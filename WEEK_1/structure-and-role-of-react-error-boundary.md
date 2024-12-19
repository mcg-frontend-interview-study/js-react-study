## ErrorBoundary를 함수형 컴포넌트로 구현할 수 없는 이유
내가 리액트를 접했을 때는 이미 대 함수형 시대였고, 실제로도 리액트에서 클래스를 써 본 적이 없어서 레거시라도 만지지 않는 이상 클래스를 볼 일은 없다고 생각했다. 
그런데 웬걸, 2024년 말에도 에러 바운더리는 클래스 컴포넌트로 구현해야 한다는 것이다!

대체 왜 아직도 클래스 스타일을 써야 하는 걸까? 답은 굉장히 간단했다. 
> 에러 처리를 담당하는 메서드가 클래스형 컴포넌트에만 있기 때문이다.

하지만 뭔가 부족한 설명이다. 마치 부분점수라도 받으려고 쓴 답변 같다.
현재 공식문서에서 클래스 컴포넌트를 함수형으로 마이그레이션할 것을 권장하는 판국인데, 왜 함수형 컴포넌트에 지원하지 않는 기능이 있는 것일까?

### 함수형 컴포넌트의 철학: 예측 가능하고 선언적인 컴포넌트
답은 함수형 컴포넌트가 지향하는 바에 있었다.

> 리액트는 **선언적** 패러다임을 기반으로, 모든 프로세스에 신경쓰는 대신 개발자가 **무엇을 만들고 싶어하는지**에 더 집중할 수 있도록 돕는다. 

이를 위해 리액트는 **순수 함수** 개념을 사용한다.
함수 컴포넌트는 기본적으로 같은 props와 state를 사용했다면 항상 같은 UI(JSX)를 내놓는 순수 함수이다. 

여기서 헷갈렸던 건 '컴포넌트가 순수하다면 자체 state를 가질 수 없는 거 아닌가?' 였다.
이 의문은 순수함의 범위가 **렌더링** 한정이라는 말로 풀렸다.

### 컴포넌트는 순수 함수이다
에시를 살펴보자. 아래 컴포넌트는 `useState`를 사용한 `count` 를 갖고 있다. 하지만 이 컴포넌트는 순수 함수이다.
```jsx
const Counter = () => {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h1>{count}</h1>
      <button onClick={() => setCount(count + 1)}>카운트 증가</button>
    </div>
  );
};
```
그 이유는 상태의 '변화'를 `useState`가 처리해주기 때문이다.
컴포넌트는 그렇게 바뀐 상태를 인지하고 그에 맞춰 UI를 렌더링한다. 따라서 컴포넌트의 "렌더링"은 순수한 것이다!
비록 useState를 컴포넌트 안에서 호출하긴 하지만 상태 변화를 다루는 책임을 훅이 갖고 있기 때문에 컴포넌트는 순수할 수 있다.

사이드 이펙트를 처리하는 `useEffect` 훅을 사용할 때도 마찬가지이다. 
`useEffect`는 렌더링을 마친 뒤 실행되므로, 여전히 컴포넌트 렌더링은 순수하다. 

<br>

이런 맥락에서 에러 처리를 살펴보면, 렌더링 중 에러가 발생했을 때 컴포넌트가 이를 포착해서 에러 상태를 가질 수 있는 게 오히려 이상해 보일 것이다. 
순수해야 하는 리액트 컴포넌트가 '렌더링 에러 상태'를 갖게 되면 컴포넌트 동작을 예측하기 어려워지기 때문이다.

일반 상태도 그냥 사용하는데, 왜 에러 상태는 가질 수 없을까? 그냥 `useState`마냥 에러 처리를 담당하는 훅을 제공하면 안 되는 걸까?

에러 발생은 기본적으로 **예측 불가능**하다. 
언제 에러가 발생할지 알 수 없고, 정확히 어떤 에러가 발생할지도 알 수 없다. 

또 순수 함수의 가장 큰 특징인 동일한 입력에 대한 동일한 출력을 보장할 수 없게 된다. 같은 props와 state를 사용해도 에러가 발생하면 기존에 리턴하던 JSX를 내놓을 수 없기 때문이다. 

이에 더해 렌더링 중에 발생한 에러를 처리하려면 리액트의 생명주기 메서드를 사용해야 하는데, 생명주기 메서드는 "에러가 일어나면, 이렇게 저렇게 해서 에러를 처리해"식이라 **명령형** 기반이다.

그러므로 에러 상태를 함수형 컴포넌트에서 관리하는 것은 여러모로 리액트의 철학에 반한다.

+리액트에서 에러 객체를 컴포넌트 안에서 사용한 적이 많다면 순간 헷갈릴 수 있는데, state로 관리하는 에러 객체는 렌더링 과정의 에러가 아니라 fetch 요청에 따른 에러처럼 사이드 이펙트와 관련된 에러라서 이 내용과 관련이 없다.

선언적인 에러 처리를 지원하기 위해 명령형 패러다임에 가까운 기능을 사용해야 한다는 점이 흥미로웠다. 

***
<br>

## 언제 ErrorBoundary를 사용해야 하는가
### 렌더링 도중 발생한 에러를 잡고 싶을 때
앞서 설명한대로 렌더링 도중에 발생한 에러를 처리하려면 무조건 에러 바운더리를 사용해야 한다. 

리액트의 렌더링 과정은 리액트가 독립적으로 관리하기 때문에 일반적인 JS의 실행 컨텍스트에서 동작하지 않는다. 그래서 아래처럼 컴포넌트를 `try-catch`로 감싸도 Fallback UI는 등장하지 않는다.
```jsx
const BuggyComponent = () => {
  throw new Error("렌더링 에러 발생!!");
};

const App = () => {
  try {
    return <BuggyComponent />;
  } catch (error) {
    console.error(error);
    return <h1>Fallback UI</h1>;
  }
};
```

생명주기 메서드를 사용하면 개입할 수 있지만 함수형 컴포넌트에서는 사용할 수 없으므로, 에러 바운더리를 사용해야 한다.


### 선언적으로 에러 UI를 보여주고 싶을 때
에러 바운더리의 `fallback`으로 에러가 발생했을 때 보여줄 UI를 직관적으로 지정할 수 있다. 

***
<br>

## ErrorBoundary가 직접 잡을 수 없는 에러들

아까와는 반대로 실행 주체가 리액트가 아니기 때문에 에러 바운더리가 잡을 수 없는 예시들이 많다. 
### 이벤트 핸들러에서 발생한 에러
이벤트 핸들러의 **실행**은 리액트가 아닌 브라우저의 event loop가 담당하므로 에러 바운더리가 잡을 수 없다.
setTimeout 콜백 안에서 발생한 에러를 setTimeout을 감싼 `try-catch`로 잡을 수 없는 원리와 유사하다. (실행 컨텍스트 이슈)

### 비동기 처리에서 발생한 에러 
비동기 처리도 마찬가지로 event loop가 담당한다. 

### SSR에서 발생한 에러
서버 쪽의 실행 컨텍스트에서 처리해야 한다. 

### 그 외
에러 바운더리 자체 에러, 리액트 외부에서 일어난 에러 등은 잡을 수 없다.

***

<br>

## 비동기 호출 with TanStack Query
앞서 비동기 호출의 에러는 에러 바운더리가 잡을 수 없다고 했지만 TanStack Query를 쓰면 가능하다. 

TanStack Query 또한 Promise 기반이지만, 리액트 렌더링 사이클과 함께 움직이기 때문에 에러 바운더리와 연동할 수 있다.
정상적인 렌더링이 끝났을 때 비동기 에러가 발생하더라도 라이브러리 내부에서 이 에러를 잡을 수 있다.

단, 쿼리 함수 혹은 전역 객체에 `throwOnError`를 true로 설정해줘야 한다. 이외에도 네트워크 에러를 제외한 HTTP 에러들은 개발자가 따로 추가적인 throw를 해 줘야 하지만 자세한 내용은 TanStack 글은 아니니까 넘기겠다.

***

<br>

## ErrorBoundary가 에러를 처리하는 법
리액트는 렌더링 도중 에러가 발생하면 `getDerivedStateFromError`와 `ComponentDidCatch`를 호출해 에러를 처리한다. 

### getDerivedStateFromError
> 에러 상태를 업데이트한다.

공식 문서의 에러 바운더리 예제에서 유일하게 `getDerivedStateFromError`만 static 메서드이다. 그 이유는 사실 이름에 잘 드러나 있다. 

이 메서드는 자식 컴포넌트에서 에러가 발생했을 때 리액트가 자동으로 실행하는 함수로, 에러 상태를 true로 설정한다. (정확히는 이 메서드의 리턴값을 리액트가 상태로 알아서 병합한다)

```jsx
static getDerivedStateFromError(error) {
    return { hasError: true };
  }
```
단순히 에러 상태만 설정해주는 함수이므로 구체적인 인스턴스 정보가 없어도 호출할 수 있다. 그래서 static 함수인 것이다.

또한 이 함수는 순수 함수이다. throw된 정보를 받아 항상 `{ hasError: true }`만 리턴하기 때문이다.

이렇게 에러 상태가 설정되면 리렌더링이 일어나 `render`가 호출되고, 지정해둔 fallback을 띄울 수 있다.

### ComponentDidCatch
> 에러 관련 정보를 로깅할 수 있다.

이어서 `ComponentDidCatch`가 실행된다. `ComponentDidCatch`는 렌더링 과정 및 생명주기 함수에서 에러가 발생할 때 실행되는 함수이다.

사실 `ComponentDidCatch`는 optional이다. 에러 상태 처리는 이미 `getDerivedStateFromError`가 마쳤기 때문이다.

대신 static 메서드이자 순수 함수였던 전의 함수와 반대로 이 메서드는 인스턴스 메서드이자 비순수 함수이다.
인스턴스 메서드이기 때문에 에러가 발생한 인스턴스만의 정보(this, props 등)에 접근할 수 있고, 비순수 함수이므로 에러 로깅이 허용된다. 
쉽게 말해 에러 상태 리턴을 제외하고 에러 처리에 필요한 모든 작업을 할 수 있는 메서드다.

(과거에는 `ComponentDidCatch`에서 `this.setState({ hasError: true });`를 호출해서 에러 상태 설정까지 담당했다는데 지금은 책임 분리 면에서 권장하지 않는다고 한다.)

```jsx
componentDidCatch(error, info) {
    //  비순수 함수이므로 이렇게 에러를 로깅할 수 있음
    logErrorToMyService(error, info.componentStack);
  
    //  "componentStack"의 예시
    //   in ComponentThatThrows (created by App)
    //   in ErrorBoundary (created by App)
    //   in div (created by App)
    //   in App
  }
```
두 번째 매개변수인 `info`는 리액트가 제공하는 컴포넌트 트리 정보를 담고 있다.
특히 `info.componentStack`에는 에러를 던진 컴포넌트와 관련된 실행 스택 정보가 담겨 있다. 


### 기본 코드
아래는 공식문서의 예제이다.
기본 예제라 그런지 딱 3가지 메서드만 사용하고 있다.
```jsx
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // Example "componentStack":
    //   in ComponentThatThrows (created by App)
    //   in ErrorBoundary (created by App)
    //   in div (created by App)
    //   in App
    logErrorToMyService(error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return this.props.fallback;
    }

    return this.props.children;
  }
}
```
여기까지가 공식 문서에 기반한 내용이다.

### 에러 상태 리셋하기
위에서는 에러 상태를 설정하는 방법만 있었다. 그렇다면 에러 상태 복구는 어떻게 해야 할까?

TanStack Query의 `resetQueryError`를 사용해 사용자가 쿼리를 재실행할 수 있는 로직을 추가하려고 한다. 
```tsx
resetErrorBoundary = () => {
    const { resetQueryError } = this.props;
    if (resetQueryError) resetQueryError();
    this.setState({ hasError: false, error: null });
  };
```
일단 에러 바운더리에 props로 `resetQueryError`를 전달해서 그대로 사용한다. 이때 초기화되는 건 쿼리 에러 상태이므로 에러 바운더리의 자체 에러 상태도 false로 갱신해줘야 한다.

그러면 이 메서드를 fallback 컴포넌트에 이렇게 넘겨줄 수 있다.
```tsx
return <FallbackComponent error={error} resetErrorBoundary={this.resetErrorBoundary} />;
```

덧. 앞에서 `componentDidCatch` 안에서 `this.setState`를 호출해 상태를 업데이트하지 말라고 했는데 여기서는 왜 사용하고 있을까?

`hasError`가 true인 것은 에러 발생을 의미한다. 
리액트 입장에서 렌더링 중 오류는 언제든지 발생할 수 있기 때문에 처리해야만 한다. 따라서 자동으로 호출되며, 규칙도 있다.

하지만 에러 상태 해제는 일차적인 렌더링과 관련이 없다. 또한 복구 작업은 어플리케이션의 성격과 로직에 따라 달라지는 부분이라 리액트가 따로 처리하지 않고 개발자의 몫으로 남아 있다.

따라서 `getDerivedStateFromError`처럼 리액트가 제공하는 메서드는 없고 해제하는 로직에서 알아서 `this.setState({ hasError: false })`등을 호출해줘야 한다.

***
<br>

## 출처
- [React v16.8](https://legacy.reactjs.org/blog/2019/02/06/react-v16.8.0.html)
- [Keeping Components Pure](https://react.dev/learn/keeping-components-pure)
- [Error Boundary](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)
- [리액트 메서드](https://react.dev/reference/react/Component#)
- [query-functions](https://tanstack.com/query/v5/docs/framework/react/guides/query-functions)
- [react-query-error-handling](https://tkdodo.eu/blog/react-query-error-handling)
