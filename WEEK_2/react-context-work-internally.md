# React Context의 내부 동작 원리: 값 변경 시 하위 컴포넌트 리렌더링에 대해

Context는 prop drilling을 피하기 위한 하나의 수단이며 데이터를 하위 트리로 전달할 수 있게 해준다.
Context는 Provider, Consumer를 제공하며 Provider value props로 값을 넣어주게 되면 Consumer가 이를 구독하여 value를 사용할 수 있다. 만일 value가 변하게 되면 Provider 하위의 컴포넌트가 리렌더링 되어 새로운 값을 보여줄 수 있게 된다. 여기서 value가 변할 때 어떤 컴포넌트가 리렌더링될까?

이를 설명하기 위해 예시를 하나 가져오면

```tsx
import React, { createContext, useContext, useEffect, useState } from "react";

const CookieContext = createContext<string | undefined>(undefined);

const CookieProvider = ({ children }: React.PropsWithChildren) => {
  const [value, setValue] = useState("cookie");

  return (
    <CookieContext.Provider value={value}>
      <button onClick={() => setValue("cookie changed")}>Update Context</button>
      {children}
    </CookieContext.Provider>
  );
};

const useCookieConsumer = () => {
  const contextValue = useContext(CookieContext);

  if (contextValue === undefined) {
    throw new Error("useCookieConsumer must be used within a CookieProvider");
  }

  return contextValue;
};

const Child1 = () => {
  useEffect(() => {
    console.log("child1 render");
  });

  const contextValue = useCookieConsumer();

  return <p>child1: {contextValue}</p>;
};

const Child2 = () => {
  useEffect(() => {
    console.log("child2 render");
  });

  return <p>child2</p>;
};

const App: React.FC = () => {
  return (
    <CookieProvider>
      <Child1 />
      <Child2 />
    </CookieProvider>
  );
};

export default App;
```

App의 구조를 보면 CookieProvider 안에 Child1 Child2 컴포넌트가 있고 Child1은 useContext로 context를 사용하며, Child2는 context를 사용하지 않는다. 렌더링 확인을 위해 Child 컴포넌트에 useEffect를 사용했다.
여기서 setValue가 실행됐을 때 useEffect의 결과는 어떻게 될까? `child1 render, child2 render` 일까? `child1 render`일까? 답은 `child1 render` 이다. useContext를 사용하는 컴포넌트 Child1만 리렌더링이 되는 모습을 확인할 수 있다.

<img src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FcF3ge0%2FbtsLC6zy5oC%2FZ2XGmAHs96Nu8XHGW8kQlK%2Fimg.png" />

이를 통해 Context 값이 변했을 때 context를 구독하는 컴포넌트만 리렌더링이 되는 것을 알 수 있다. 이 이유를 Context의 내부 동작을 살펴보면서 알아보도록 한다.

### React.CreateContext

먼저 Context를 생성하는 CreateContext 부터 살펴보면 아래 구조로 되어있다.

```tsx
interface Context<T> {
  Provider: Provider<T>;
  Consumer: Consumer<T>;
  ...
}

function createContext<T>(
  defaultValue: T
): Context<T>;
```

createContext는 기본값을 받으며 Provider와 Consumer를 반환한다. 더 자세히 살펴보면

```ts
export function createContext<T>(defaultValue: T): ReactContext<T> {
  const context: ReactContext<T> = {
    $$typeof: REACT_CONTEXT_TYPE,
    _currentValue: defaultValue,
    _currentValue2: defaultValue,
    _threadCount: 0,
    Provider: (null: any),
    Consumer: (null: any),
  };

  context.Provider = {
    $$typeof: REACT_PROVIDER_TYPE,
    _context: context,
  };
  context.Consumer = context;
  ...
  return context;
}```

createContext 메서드는 context라는 객체를 만들어서 Provider에 _context 프로퍼티에 저장하고 동일하게 Consumer에도 저장한다. 여기서 반환된 context는 return문 안에 Context.Provider, Context.Consumer 형식으로 사용할 수 있게 된다.

이제 Context.Provider 부터 설명을 시작할텐데 그 전에 하나 상황을 가정하자면 아래 시점부터는 초기 랜더링이 완료되었고 setValue를 호출하여 context 값을 바꾼 순간부터라고 생각해줬으면 한다.


### Provider

```tsx
<CookieContext.Provider value={value} />
```

상태가 변해서 리렌더링이 됐을 때 App 파이버 트리부터 beginWork를 실행하여 값을 비교하게 된다. work in progress가 Provider가 되고 beginWork가 실행될 때 아래 updateContextProvider가 실행된다.

```tsx
function beginWork() {
  case ContextProvider:
      return updateContextProvider(current, workInProgress, renderLanes);
}

function updateContextProvider(
  current: Fiber | null,
  workInProgress: Fiber,
  renderLanes: Lanes,
) {
  const providerType: ReactProviderType<any> = workInProgress.type; // CookieContext.Provider
  const context: ReactContext<any> = providerType._context; // context object

  const newProps = workInProgress.pendingProps; // {value: "cookie changed", children: ...}
  const oldProps = workInProgress.memoizedProps; // {value: "cookie", children: ...}
  const newValue = newProps.value; // cookie changed
  pushProvider(workInProgress, context, newValue);
  ... // push provider 설명 이후에 이어서
}
```
<img src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FdeCN6L%2FbtsLCtWlRnB%2FMl48xcR97qFMdfqYURiN0K%2Fimg.png" />

context를 ProviderType.\_context에서 가져오게 되는데 이는 아래의 context.Provider의 \_context를 불러오게 된다.

```ts
context.Provider = {
  $$typeof: REACT_PROVIDER_TYPE,
  _context: context,
};
```

현재 workInProgress는 CookieContext.Provider이며 workInProgress.type._context로 context를 가져오게 되는데 위 그림과 같이 가져올 수 있다. 

그 다음으로는 workInProgress에서 이전 값과 변경된 값을 가져오게 된다. workInProgress Fiber에는 변경될 값인 pendingProps, 이전 값인 memoizedProps 정보를 가지고 있으며 이전 값은 cookie이고 새로 변경된 값은 cookie changed이다.

그 후 pushProvider를 호출하여 fiber 스택에 새로운 값을 push하게 된다. 이는 나중에 Consumer(useContext)가 호출될 때 값을 참조하기 위해서이다.


### pushProvider

```tsx
export function pushProvider<T>(
  providerFiber: Fiber,
  context: ReactContext<T>,
  nextValue: T
): void {
  if (isPrimaryRenderer) {
    push(valueCursor, context._currentValue, providerFiber);
    context._currentValue = nextValue;
  } else {
    ...
  }
}
```
<img src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FGD1kE%2FbtsLA5IR08b%2FZ8fPeAookPEWto5QKcqXg0%2Fimg.png" />

pushProvider는 Fiber Stack에 새로운 값을 push하는 역할을 한다. 초기에 렌더링될 때 초기값인 `cookie`가 스택에 쌓이고, `cookie`가 `cookie changed`로 바뀌며 리렌더링이 될 때, 스택에 새로운 값이 푸시되어 스택의 상태는 `cookie`, `cookie changed` 상태가 되며 바뀐 상태를 바라보게 된다.

그 후 context._currentValue에 바뀐 값 `cookie changed`이 저장되어 consumer가 새로운 값을 참조할 수 있게 설정한다.


### updateContextProvider 이어서

pushProvider가 실행된 뒤 다시 updateContextProvider로 돌아오면 아래 구문이 실행된다.

```ts
...
const oldValue = oldProps.value; // cookie
if (is(oldValue, newValue)) { // cookie !== cookie changed
  if (
    oldProps.children === newProps.children &&
    !hasLegacyContextChanged()
  ) { // 상태가 변하지 않으면 리렌더링을 하지 않음
    return bailoutOnAlreadyFinishedWork(
      current,
      workInProgress,
      renderLanes,
    );
  }
} else {
  propagateContextChange(workInProgress, context, renderLanes); // consumer에게 상태가 변했음을 전파
}
...
```
<img src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2Fc1lh7Y%2FbtsLBZVIdPm%2FjKnJd3npmjKkPdrWHf1V8k%2Fimg.png" />

Object.is 메서드를 사용하여 oldValue와 newValue가 같은 값인지를 비교한 후 같으면 bailout을 호출하여 리렌더링을 하지 않게 된다. (여기서 Object.is란 === 비교 연산자의 보완된 메서드라고 생각하면 된다.)

이 경우에는 값이 달라졌고 consumer에게 상태가 변했음을 알리게 된다. 여기서는 `cookie`와 `cookie changed`값이 같지 않기 때문에 상태가 변했음을 알리는 propagateContextChange 함수가 호출된다.


### propagateContextChange

<img src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FmBONU%2FbtsLDfDgh2D%2FfzbCCNfcoESiLKvcG7OzOK%2Fimg.png" />

propagateContextChange은 context 값이 변경된 후 그 값을 사용하는 Consumer에게 값이 변했음을 알리는 역할을 한다. 이 과정을 수행하기 위해 두 가지 과정을 거친다.

1. Consumer 찾기
2. 해당 컴포넌트 리렌더링

먼저 workInProgress fiber인 Context.Provider 하위 Fiber는 button, Child1, Child2 중 어느 컴포넌트가 CookieContext의 Consumer일지 찾는 과정을 거친다. 결과 useContext(CookieContext)가 호출된 Child1이 CookieContext의 Consumer임을 알아내게 된다.

그 후 Consumer인 Child1이 리렌더링 되도록 트리거하게 된다. context의 값이 변했으니 context를 사용하는 Child1이 리렌더링되고 context를 사용하지 않는 button, Child2는 리렌더링이 되지 않는다.

여기서 질문의 해답이 나오게 되는데 Provider 하위의 모든 컴포넌트가 리렌더링이 되지 않고 context를 사용하는 컴포넌트만 리렌더링 되는 이유는 `propagateContextChange`가 context와 관련이 있는 컴포넌트를 찾고 이 컴포넌트만 리렌더링 시키기 때문이다.

### Consumer

`propagateContextChange`가 실행되어 Child1이 리렌더링 되고 beginWork가 실행되며 updateContextConsumer가 실행된다.

```tsx
function beginWork() {
  case ContextConsumer:
      return updateContextConsumer(current, workInProgress, renderLanes);
}

function updateContextConsumer(
  current: Fiber | null,
  workInProgress: Fiber,
  renderLanes: Lanes
) {
  let context: ReactContext<any> = workInProgress.type; // CookieContext의 context object

  const newProps = workInProgress.pendingProps; // {value: "cookie changed" children: ...}
  const render = newProps.children;
  prepareToReadContext(workInProgress, renderLanes); //workInProgress Fiber 노드를 기준으로 Context를 읽을 준비

  const newValue = readContext(context); // context의 최신 값을 읽어옴

  let newChildren;
  newChildren = render(newValue); // <p>child1: cookie changed</p>
  ...
}
```

workInProgress인 Child1의 type인 context 객체를 불러온 뒤 새로운 props와 그 children을 불러온다.
그리고 Child1 파이버 기준으로 Context를 읽을 준비를 마친 뒤 readContext 함수가 실행되어 context의 최신 값인 `cookie changed`를 읽어온다. 그 후 newProps.children의 render 메서드를 실행하여 새로운 값을 대입하여 화면을 바꾸게 된다.

## 결론

Context의 값이 변할 때, Context를 구독하는 소비자(Consumer) 컴포넌트만 리렌더링된다는 점을 내부 구현을 통해 확인할 수 있었다. 이 동작 원리를 잘 이해하고 Context를 사용할 경우, 불필요한 렌더링을 줄여 렌더링 최적화를 할 수 있을 것이라 생각한다.

## 참고문헌

[How does Context work internally in React?](https://jser.dev/react/2021/07/28/how-does-context-work/)
