# [WEEK_2] useRef

# 이 훅은 뭔가요?

렌더링에 필요하지 않은 값을 참조할 수 있도록 react에서 제공하고 있는 훅입니다.

<br />
<br />

# useRef가 만들어진 이유는 무엇인가요?

앞선 답변에서 알 수 있지만, 렌더링 사이에서 값을 유지시키고 또 이 값의 변화로 인해 리렌더링이 발생하지 않는 변수가 필요했습니다.
일반 변수를 컴포넌트 안에서 선언해 사용할 경우 함수를 다시 호출할 때마다 초기화가 되기 때문에 렌더링 사이에서 값이 지속되지 않습니다.

클래스형 컴포넌트를 사용할 때에는 인스턴스 필드에 값을 저장해두면 useRef로 선언한 값처럼 렌더링 사이에서도 값이 유지되었지만, 함수형 컴포넌트에서는 리렌더링마다 함수가 다시 호출되기 때문에 값을 유지할 수 없었습니다.

그래서 클래스형 컴포넌트에서 가능한 값 유지를 함수형 컴포넌트에서도 가능하도록 하기 위해 useRef라는 훅이 탄생하게 되었습니다.

<br />
<br />

# 사용 목적은 주로 뭐죠?

1. 렌더링 사이에서 값을 유지시켜야 하는 경우
2. 값이 변화해도 리렌더링을 트리거하고 싶지 않은 경우
3. DOM을 조작하고 싶은 경우

<br />
<br />

# 왜 useRef는 useState처럼 값이 변해도 리렌더링 되지 않는건가요?

useState의 경우 상태를 업데이트 하기 위해서는 전용 setter를 사용합니다. 이 setter는 리렌더링을 트리거하는 매커니즘이 포함되어있기 때문에 리렌더링이 발생하는거죠.

그래서 직접 useState의 상태를 setter사용하지 않고 변경할 경우 리렌더링이 발생하지 않습니다.
마찬가지로 useRef의 경우도 전용 setter를 이용해 값을 변경하는 것이 아니라, 개발자가 current 프로퍼티에 직접 값을 수정해 업데이트하기 때문에 리렌더링이 발생하지 않습니다.

<br />
<br />

# useRef는 내부적으로 어떻게 구현되어있나요?

구현은 크게 두 가지로 이루어져 있습니다.

1. attach ref
2. detach ref

ref를 부착하고(`ref={ref}`) 제거하는 두 개의 과정입니다. 하나씩 알아보도록 하겠습니다.

## 1. attach ref

react의 렌더링 단계인 commit단계에서 ref가 부착됩니다. 이때 commitAttachRef라는 함수 안에서 실제로 ref가 attach되는데요.

```js
// 주제 내용과 거리가 있는 코드는 제거된 편집 코드입니다.

function commitAttachRef(finishedWork: Fiber) {
  const ref = finishedWork.ref; // 현재 fiber의 ref(ref={ref})를 가져옵니다.

  if (ref !== null) {
    const instance = finishedWork.stateNode; // 현재 DOM(local state라는 용어를 씀)
    let instanceToUse;

    switch (finishedWork.tag) {
      case HostComponent: // div, span같은 HTML기본 요소들
        instanceToUse = getPublicInstance(instance); // 공개된 인스턴스(DOM요소) 가져오기(getPublicInstance함수는 코드를 보니 그냥 instance를 바로 return => instance 자체가 진짜 DOM인 것으로 추정됨)
        break;
      default:
        instanceToUse = instance;
    }

    ref.current = instanceToUse; // ref.current에 DOM요소 주입
  }
}
```

1. 현재 작업중인 파이버인 finishedWork Fiber의 ref prop을 가져옵니다.
2. 만약 그 값이 null이 아니라면, stateNode로 실제 컴포넌트의 DOM 요소를 가져옵니다.
3. ref.current에 할당합니다.

매우 간단한 과정입니다.

<br />
<br />

### 2. detach ref

detach는 언마운트 되거나, 또는 다른 요소로 ref가 변경될 경우 수행됩니다.
따라서 finishedWork가 아닌 current fiber에서 ref를 detach 합니다.

어차피 finishedWork가 current가 되기 때문에 굳이 버려질 이전의 current에서 detach하는게 굳이 필요한 과정이냐 라고 할 수 있지만, 메모리 누수를 막기 위해 필요합니다. (안쓰고 있는데 값을 참조하고 있을 필요 없음)

```js
function commitDetachRef(current: Fiber) {
  const currentRef = current.ref; // current의 ref prop을 가져옵니다.

  if (currentRef !== null) {
    currentRef.current = null; // current 프로퍼티를 null로 초기화합니다.
  }
}
```

1. current.ref를 가져옵니다.
2. 1에서 가져온 값에 null을 할당해 초기화합니다.

아주 간단합니다.

<br />
<br />

# react는 어떻게 attach, detach를 감지하나요?

useRef를 변경할 경우 useState의 setter처럼 값이 변경되었으니 리렌더링하라 라고 알리는 매커니즘이 없습니다.
그러면 react는 useRef가 attach, detach되었는지 어떻게 판단할 수 있을까요?

바로 beginWork가 실행될 때 markRef 함수가 실행됩니다. 그리고 이때 마킹을 해두어 attach 여부를 판단할 수 있습니다.

```js
function markRef(current: Fiber | null, workInProgress: Fiber) {
  // current는 이전 Fiber, workInProgress는 작업중인 Fiber
  const ref = workInProgress.ref; // 작업중인 Fiber의 ref가져오기
  if (
    (current === null && ref !== null) || // 이전 Fiber가 없으며 현재 ref가 있을 때
    (current !== null && current.ref !== ref) // 이전 Fiber가 있으며, 현재 ref와는 다를 때
  ) {
    workInProgress.flags |= Ref;
  }
}
```

이전 Fiber가 없으며 현재 ref가 있거나, 이전 Fiber가 있으나 현재 ref와는 다를 때 ref가 변경되었다는 flag로 세팅합니다.

그리고 이후 flags의 변경 여부 판독 후 attach, detach를 수행하게 됩니다.

```js
if (flags & Ref) {
  // ref가 변경되었다는 flag일 경우 attach
  commitAttachRef(finishedWork);
}

if (flags & Ref) {
  // 변경이 되었으며
  const current = finishedWork.alternate;
  if (current !== null) {
    // 이전 current Fiber가 null이 아닐 경우(사용되지 않게될 Fiber가 있음)
    commitDetachRef(current); // detach
  }
}
```

ref 변동되었을 때 attach하고, 변동 되었으며 current가 존재할 경우 detach합니다.

<br />
<br />

# 참고 자료

https://jser.dev/react/2021/12/05/how-does-useRef-work/
