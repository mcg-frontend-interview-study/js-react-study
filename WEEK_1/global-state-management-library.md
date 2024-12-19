# 패턴으로 알아보는 전역 상태 라이브러리

본 글은 `상태 관리 라이브러리의 패턴`에 집중하여, 개별 라이브러리의 자세한 사용 방법 등의 내용은 생략하겠습니다.

## Prop Drilling

- React와 같은 컴포넌트 기반 라이브러리/프레임워크에서 부모 컴포넌트가 자식 컴포넌트로 데이터를 전달하는데, 이때 여러 컴포넌트를 거치며 전달되는 패턴입니다.

### Prop Drilling이 왜 문제가 돼?

- 거쳐가는 컴포넌트 계층이 많아지면 데이터가 어디서 왔는지, 어떻게 사용되는지 알기 힘들게 됩니다.
- 또한, 데이터가 거쳐가는 컴포넌트들이 불필요하게 `props` 를 전달하면서 코드 복잡성을 증가시키고 컴포넌트 재사용을 떨어뜨리게 됩니다.

## 그럼 어떻게 해결할 수 있어?

해결 방법은 크게 세 가지가 있는데요.

1. Context API
2. Custom Hook
3. **전역 상태 라이브러리**

이 중, 전역 상태 라이브러리의 `패턴`을 위주로 다뤄볼 예정입니다.

## 전역 상태 라이브러리 패턴

전역 상태 라이브러리를 패턴을 기준으로 나누면 다음과 같습니다.

1. Flux 패턴 : Redux, Zustand
2. Atomic 패턴 : Recoil, Jotai
3. Proxy 패턴 : MobX, Valtio

### Flux 패턴

Flux 패턴의 특징

- 단방향의 데이터 흐름
    <aside>
    👉🏻 Action → Dispatch → Store → View
    
    </aside>
    
    - 데이터가 한쪽 방향으로만 흐르므로 데이터 흐름을 추적하기 쉽고 코드 이해가 쉬워집니다.
    - **Action** : 어플리케이션에서 발생하는 이벤트 및 이벤트가 발생했을 때 스토어에 보낼 데이터. 사용자가 버튼을 클릭하거나 서버로부터 데이터를 받아올 때 등 `Action`이 생성됩니다.
    - **Dispatcher** : Flux에서 모든 `Action`을 받아 `Store`로 보내는 중개자 역할.
        - Redux에서는 Dispatcher가 내장되어 있어 `Reducer` 가 상태 변경 처리.
    - **Store** : 상태를 저장하고 관리하는 공간. `Dispatch`로부터 `Action`을 받아 저장된 상태를 업데이트하고, 상태 변경을 구독하고 있는 `View`에게 알립니다.
    - **View** : `Store` 에서 만들어진 데이터를 화면에 보여주는 역할. 구독 중인 상태가 변경되면 화면을 다시 렌더링합니다.

예를 들어 볼까요?

```markdown
배가 고파 식당에 방문한 A는 메뉴를 고릅니다.

테이블에 놓여진 주문서에 메뉴를 작성합니다. (Action)

직원을 불러, 주문서를 전달합니다. (Dispatch)

직원은 포스기에 주문 받은 메뉴를 저장하고 업데이트합니다. (Store 업데이트)

주문한 음식이 A의 테이블에 도착합니다. (View)
```

### Flux 패턴을 갖는 라이브러리

1. Redux

- Flux 패턴을 구현하기 위한 라이브러리.
- 하나의 `Store` (저장 공간)을 사용하여 모든 상태를 관리하는 특징이 있습니다.
- 보일러 플레이트를 줄이기 위해 Redux toolkit과 함께 사용합니다.
- 비동기 작업을 처리하기 위해서 `reudx-thunk` 나 `redux-saga` 와 같은 Middleware 사용이 필요합니다.

2. Zustand

- Redux와 유사하지만, 보일러 플레이트가 거의 없고 설정이 단순한 편.
- 기본적으로 Middleware가 지원되어 비동기 작업 처리가 가능합니다.

### Atomic 패턴

<img src='https://velog.velcdn.com/images/buddle6091/post/f2874990-36b3-4f01-9959-9e01fb32a073/image.png' />

- 상태를 작은 원자 단위 `atom` 으로 분리하여 관리하는 방식. 따라서 데이터의 개별 값들이 이전 상태에 대한 불변성을 유지합니다.
- 하나의 `atom` 은 다른 `atom` 이나 `Selector` 에 의해 의존되거나 파생될 수 있습니다.
- 상태를 사용하는 컴포넌트가 직접 특정 `atom` 을 구독하고, 이 `atom` 이 변경될 때만 `atom` 을 사용하는 컴포넌트가 리렌더링됩니다.

`Selector`

- `atom` 으로부터 파생된 상태를 다루는 함수.
- `atom` 상태가 변경될 때만 다시 계산됩니다.

예를 들어 볼까요?

```markdown
놀이공원에 친구들과 방문한 A는 교복을 대여하러 가게를 방문합니다.

대여점에는 여러 종류의 교복이 있습니다. (Atom)

교복에 넥타이를 멜 수도 있고, 메지 않을 수도 있습니다. (파생 상태, Selector)

교복을 대여한 A는 핫도그를 먹다 케찹을 교복에 흘려 교복에 자국이 남았습니다. (Atom 상태 변경)

아뿔싸! 마침 챙겨온 싹스틱으로 케찹을 깔끔하게 지웠습니다. (Selector를 통한 상태 변경)
```

### Flux 패턴과 차이점이 뭐야?

- **상태 관리 측면**
  - Flux 패턴
    - 중앙(`Store`)에서 상태를 관리합니다. 따라서 `Store` 에서 컴포넌트로 상태를 전달하는, `Top-down` 방식으로 상태 전달이 이루어집니다.
  - Atomic 패턴
    - 상태를 여러 개의 독립적인 `atom` 으로 분리하여 관리합니다. Flux 패턴과는 반대로 `Bottom-up` 방식으로 상태 전달이 이루어집니다.
- **데이터의 흐름 측면**
  - Flux 패턴
    - 단방향의 데이터 흐름을 갖고 있습니다. (Action → Dispatch → Store → View)
    - 상태의 변경은 `Action` 과 상태 변경을 일으키는 `Dispatcher` 를 통해서만 가능합니다.
  - Atomic 패턴
    - 상태를 독립적인 `atom` 단위로 관리하고, 상태가 구독을 기반으로 작동합니다.
    - `Atom` 을 직접 변경하거나, `Selector` 를 통해 파생된 상태를 생성할 수 있습니다.

### Atomic 패턴을 갖는 라이브러리

1. Recoil

- `Atom` 과 `Selector` 를 통해 상태 관리 가능한 라이브러리.
- 사용하기 간편한 장점이 있지만, 버전이 약 2년 전에 업데이트 된 `0.7.7` 에 머물러 있어 대응하지 못한 버그가 존재할 수 있다는 단점이 있습니다.

2. Jotai

- Recoil에서 영감을 받아 개발된 라이브러리. 실제 사용 방법이 Recoil과 매우 유사합니다.
- Recoil과는 다르게, 활발하게 업데이트 되고 있습니다.

### Proxy 패턴

- 상태를 `대리 객체` 인 `Proxy`로 감싸고, 조회 및 할당, 열거, 함수 호출 등 여러 기본 동작을 가로채 다른 동작을 첨가하는 대리자 역할. 상태 변경을 자동으로 감지하여 컴포넌트를 업데이트합니다.
  - Proxy : 어떤 객체에 접근할 때 직접 접근하지 않고, 객체와 상호작용하기 위한 중간 역할을 하는 객체.
- 자동으로 상태 변경을 감지하기 때문에 로직을 단순하게 작성할 수 있어 편리하지만, 상태가 언제 변하는지 추적이 어렵다는 단점이 있습니다.

예를 들어 봅시다.

```markdown
배가 고픈 A가 있습니다. 배에서는 꼬르륵 소리가 나고 있네요.

마침 배달이 도착해 햄버거를 한 입 베어 물었습니다.

이때, 신경 세포는 햄버거가 입에 들어온 것을 감지합니다.

신경 세포는 뇌에게 음식물이 들어오고 있음을 알리고, (신경 세포 = Proxy)

배가 부른 A는 기분이 좋아졌습니다. (상태 변경)
```

### 다른 패턴들과 차이점이 뭐야?

- Proxy 패턴의 적용 대상은 `객체` 로, 다른 패턴은 전역 상태를 관리한다면 이 패턴은 `객체` 의 상태 변경 동작이나 데이터 흐름을 중간에서 가로채고 제어하는 데 초점을 맞추고 있습니다.
- 반면, Flux와 Atomic 패턴은 상태 관리를 위한 아키텍처입니다.
- 상태 변경 요청이 오면 요청을 가로채어 작업을 한 뒤 원래 객체에 전달하는 방식입니다. 따라서 데이터의 흐름은 **요청 → Proxy → 원래 객체** 의 형태를 갖고 있습니다.

```jsx
let obj = {
  name: '웨디',
  print: function () {
    console.log(`${this.name}`);
  },
};

obj.print = new Proxy(obj.print, {
  apply(target, thisArg, args) {
    console.log('target: ', target); // obj.print() 함수 출력
    console.log('thisArg: ', thisArg); // this가 가리키는 obj 출력
    console.log('args: ', args); // 매개변수 배열. [] 출력

    console.log('이름 변경!');
    thisArg.name = '올리';

    // 대상 원본 함수 실행
    Reflect.apply(target, thisArg, args); // 올리 출력
  },
});

obj.print();
```

### Proxy 패턴을 갖는 라이브러리

1. MobX

- `Java` 의 Annotation과 유사한 `Decorator` 를 제공하고 `Class` 를 객체지향적으로 사용하고 있기 때문에 `Spring` 프레임워크와 유사한 아키텍쳐 구조를 갖고 있습니다. 따라서 서버 개발에 익숙한 개발자 분들은 친숙함을 느끼실 수도 있습니다.
- 상태를 관찰 가능하게 (`Observable`) 지정하여 상태 변경을 자동으로 감지합니다.

  ```jsx
  // MobX Store

  class TodoStore {
    @observable
    todoList = [];

    constructor(rootStore) {
      this.rootStore = rootStore;
    }
    // ...
  }
  ```

2. Valtio

- `proxy` , `snapshot` , `useSnapshot` 만으로 상태를 관리합니다.
  - snapshot : proxy 객체를 복사하여 읽기 전용 불변 객체를 생성. 원본과는 독립적으로 동작합니다.
  - useSnapshot : 상태를 구독하고, 상태 변경 시 컴포넌트가 자동으로 리렌더 되도록 합니다.

### 참고 자료

[Redux-보일러플레이트 줄이기](https://ko.redux.js.org/usage/reducing-boilerplate/)

[Zustand](https://zustand.docs.pmnd.rs/getting-started/comparison)

[상태관리 패턴에 따른 상태관리 라이브러리 분석하기](https://velog.io/@buddle6091/%EC%83%81%ED%83%9C%EA%B4%80%EB%A6%AC-%ED%8C%A8%ED%84%B4%EC%97%90-%EB%94%B0%EB%A5%B8-%EC%83%81%ED%83%9C%EA%B4%80%EB%A6%AC-%EB%9D%BC%EC%9D%B4%EB%B8%8C%EB%9F%AC%EB%A6%AC-%EB%B6%84%EC%84%9D%ED%95%98%EA%B8%B0)

[MobX](https://ko.mobx.js.org/README.html)

[React에서 Mobx 경험기 (Redux와 비교기)](https://techblog.woowahan.com/2599/)

[💠 프록시(Proxy) 패턴 - 완벽 마스터하기](https://inpa.tistory.com/entry/GOF-%F0%9F%92%A0-%ED%94%84%EB%A1%9D%EC%8B%9CProxy-%ED%8C%A8%ED%84%B4-%EC%A0%9C%EB%8C%80%EB%A1%9C-%EB%B0%B0%EC%9B%8C%EB%B3%B4%EC%9E%90)
