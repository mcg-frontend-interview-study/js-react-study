# Zustand VS. Jotai

이번 글은 의식의 흐름에 충실하게 써보았습니다... 

<br>

## 둘을 비교하는 이유
많은 상태 관리 라이브러리 중에서 둘을 비교하게 된 이유는 개인적인 궁금증 때문이다. (With 우테코)

[출처](https://fe-tool.com/awesome-react-state-management)에 따르면, 리액트 상태 관리 라이브러리 중 NPM 주간 다운로드 순위는 다음과 같았다.
(2025년 1월 기준) 
![image](https://github.com/user-attachments/assets/97dca40b-4ee1-4161-a896-eaba3c75cc49)


역시 Redux가 압도적 1위였고(아직도!) 그 뒤를 Zustand가 이었다. 나머지 순위들은 valtio까지 한번 끊어볼 수 있겠다. 

하지만 1위 Redux는 여러모로 복잡한 점이 많은 데 비해 소규모 프로젝트 수준에서 얻을 수 있는 이점이 적다. 그래서인지 우테코 프로젝트에서도 대부분 다른 라이브러리를 사용하는 것 같았다. 상태 관리 라이브러리를 사용한다면 대개 Zustand를 사용하는 듯 했는데, Redux와 같은 패턴을 사용하되 훨씬 가볍고 자료가 많아서가 아닐까 싶다. 

우리 팀에서도 Zustand 사용을 고려했지만 기획이 자주 바뀌던 프로젝트 초창기라 서비스에 어떤 상태 관리 방식이 적합할지 판단하기가 어려웠다. 다른 라이브러리들을 정하는 김에 함께 정했지만 언제 사용하게 될지도 미정이었다. 그래서 미션에서 모두가 사용해봤던 Recoil을 우선 채택했다. 

이후 상태 관리가 복잡해지며 Recoil을 실제로 프로젝트에 도입했지만, 한시바삐 구현을 해야 했기에 현재 로직에서 Recoil이 최적인지는 따로 이야기하지 못했다. 이런 아쉬움이 상태 관리 라이브러리를 조사하는 계기가 됐다. 

Recoil 대신 Jotai를 조사한 이유는 Recoil의 업데이트가 중단됐기 때문이다. 이 이유로 Recoil을 다른 상태 관리 라이브러리로 마이그레이션하자는 의견도 나왔다. 만약 마이그레이션한다면 어떤 라이브러리가 좋을지를 알아보고 싶었다. 상기한 이유로 후보는 Zustand, Recoil과 같은 패턴을 사용하는 Jotai가 되었다. 

***

먼저 간단하게 공통점과 차이점을 살펴보고 바로 투두리스트를 만들어보기로 했다.

## 공통점
- 개발자가 같다.
- React 환경을 지원한다. 
- 초기 설정이 **간편**하고, 상태를 사용하는 방식도 단순하다. (비교군은 Redux, MobX)

## Zustand
> **중앙 집중형**으로, 상태를 하나의 **Store**에서 관리한다. 
> 모든 상태는 중앙 Store에서 -> 상태를 사용하는 컴포넌트로 내려간다. (Top-down)

### 개요
- 중앙 집중형 + Top-Down이므로 상태 예측이 쉽고 관리 방식도 단순하다.
- 반대로 단순하고 일방적인 상태 관리가 장점인 만큼 Store의 규모가 커질 경우 오히려 가독성이 떨어지고 관리가 어려워진다. 
	- 예) 상태끼리 의존 관계가 있는 경우 유지보수 비용이 상승

### 모듈의 위치
- React 외부에서 관리된다. 즉 전역 JavaScript 메모리에 저장된다.
- 클로저를 이용해 데이터를 관리하므로 생명주기에 어긋나지 않는 데이터를 보장한다.
- React 외부에서도 Zustand 상태에 접근할 수 있다. 

--- 
## Jotai
> **분산형** 으로, 상태를 원하는 규모로 쪼개서 각자의 **Atom**으로 관리한다.
> 모든 상태는 개별적으로 관리되며 상태의 파생 상태를 쉽게 만들 수 있다. 
> 개별 상태를 필요한 컴포넌트에서 끌어다 사용한다. (Bottom-up)

### 개요 
- Zustand의 장단점을 바꾼 형태이다.
- 상태를 쪼개서 관리하므로 필요한 값들만 묶어서 관리할 수 있고, 상태끼리의 의존성 관리가 편하다. 
- 상태가 분산되어 있기에 애플리케이션 내부의 상태들을 한눈에 파악하기 어렵고, 상태 추적이 까다롭다. 

### 모듈의 위치
- React 내부에 위치해 있다. 
- 더 자세히 설명하자면, Context API의 Provider와 비슷하다.
	- Provider를 통해 상태를 전달받을 수 있다.
	- 상태는 Provider별로 관리된다. 
		- 같은 atom 상태라도 Provider가 다르면 다른 값으로 간주한다.
		- Provider에 직접 스코프를 설정할 수 있다. (Symbol 자료형 사용 권장)
- 하지만 실제 Context API의 Provider와는 달리 전역 상태를 위해서라면 별도의 Provider 없이 사용할 수 있다. 
- React 문법과 유사하게 사용할 수 있다. 

***
## TODO LIST 만들어보기
역시 실습은 모두의 투두리스트이다. (Jotai 공식문서에서도 투두 만듦)

완료한 할 일, 아직 하지 않은 할 일을 카운트해서 보여주는 투두리스트를 만들어보면서 각 라이브러리의 특징을 알아보기로 했다. 

![image](https://github.com/user-attachments/assets/5bec840e-8e8e-4ad2-a620-dfbcb7054a4a)


### 투두리스트 명세서
- 기본 기능: 투두 추가 및 삭제
	- input에 투두를 입력하고 엔터를 누르면 새 투두 아이템을 추가할 수 있다.
	- 목록에 추가된 투두를 클릭하면 완료한 일이 되어 취소선이 그어진다. (반대로 원상복구도 가능)
- 추가 기능 1: 필터링 기능
	- 전체, 완료한 일, 미완료한 일 키워드를 추가한다.
	- 각 키워드에 해당하는 투두만 목록에 출력한다.
- 추가 기능 2: 미완료, 완료 투두 개수를 실시간으로 출력한다. 
- 추가 기능 3: 새로고침이 일어나도 상태가 저장되도록 localstorage를 사용한다.

먼저 기본 기능부터 구현해보자!
우선 전체 투두리스트를 저장하는 상태가 필요할 것 같다. 

### Zustand로 구현하기
>[!warning] 리액트 환경에서 Zustand를 사용하는 예제입니다.

Zustand 상태는 Store에 저장된다. Store는 `create` 함수로 만들 수 있다. 
```jsx
export const useTodoStore = create((set, get) => ({
  todos: [],
}));
```
`create`는 상태를 조작할 수 있는 `set`과 `get`을 제공한다. 동작은 예상할 수 있듯 기존 상태를 인자로 받아 새 상태를 리턴/현재 상태를 리턴하는 함수이다. 
`create`의 리턴값은 커스텀 훅으로, 이 Store에서 정의한 상태를 구독하고, 상태 업데이트 함수에 접근할 수 있게 해준다.

상태나 함수는 `create`의 리턴값으로 제공하면 된다. 곧바로 리턴값에 제일 기본이 되는 투두 배열을 선언해줬다. 
전체 투두 배열에 이어 현재 선택된 필터링 값 및 그에 따라 필터링된 리스트를 저장하는 상태도 필요할 것 같다. 다만 filteredTodos 상태를 추가하면 코드가 조금 복잡해져서 먼저 todos만 사용해보기로 했다. 
```jsx
export const useTodoStore = create((set, get) => ({
  todos: [],
  filter: "all", // "all" | "completed" | "incomplete",
}));
```
이것으로 간단하게 상태 설정을 마쳤다! 
이제 이 상태들을 사용할 수 있는 함수들을 선언할 차례이다.

가장 먼저 투두를 추가하는 함수를 만들어보자.
Zustand 상태(여기서는 todos 배열)를 바꾸는 작업이므로 Zustand에서 제공하는 `set` 함수를 써야 한다. 
```jsx
addTodo: (param) => set((state) => {});
```
대략 이런 형태인데, 매개변수로 함수를 호출하면 내부에서 Zustand의 `set`을 사용하게끔 한다. 
`set`의 매개변수 `state`는 이전 상태(prevState)로, 이 값을 가공해서 새로운 값을 만들면 된다. 

```jsx
export const useTodoStore = create((set, get) => ({
  ...

  addTodo: (text) => set((state) => ({ todos: [...state.todos, { id: Date.now(), text, completed: false }], })),
  }));
```
매개변수로 사용자가 입력한 투두 값 `text`를 받고, 이전 상태를 기반으로 새로운 투두 배열을 리턴해줬다. 
이제 다른 함수들을 쉽게 선언할 수 있을 것이다!

```jsx
...

toggleTodo: (id) =>
    set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
		),
    })),
deleteTodo: (id) =>
    set((state) => ({
          todos: state.todos.filter((todo) => todo.id !== id),
    })),
```
완료 상태를 토글하는 toggleTodo와 투두를 삭제하는 deleteTodo 함수를 추가했다. 
각자 필요한 매개변수를 받아 새로운 상태를 리턴하고 있다. 

이것으로 투두리스트 기본 동작은 모두 만족했다. 이제 filter 상태를 처리해볼 차례이다. 
필터값을 바꾸는 함수는 아주 쉽게 만들 수 있다. 
```jsx
setFilter: (filter) => set(() => ({ filter }))
```
이제 이 값을 가지고 필터링 함수를 만들 차례이다. 
필터링을 하려면 필터링 대상인 원본 배열과 필터링값이 필요하다. 지금 이 값들은 Store를 사용해서 Zustand 상태로 만들어뒀다. 같은 스코프 안에 있으니까 이렇게 접근하면 되지 않을까?
```jsx
export const useTodoStore = create((set, get) => ({
  todos: [],
  filter: "all", // "all" | "completed" | "incomplete",
  
  ...,
  
  getFilteredTodos: () => {
	if (filter === "completed"){
      return todos.filter((todo) => todo.completed);
    }
    ...
  }
}));
```
물어보는 데서 느꼈겠지만(어쩌면 스코프를 보고 느꼈을지도!) 이렇게 하면 안 된다. 값에 직접 접근했기 때문인데, 이렇게 직접 접근하는 대신 `get`을 사용해 상태에 접근해야 한다. 

Zustand에서는 크게 두 가지 이유로 값에 직접 접근할 수 없다. 
먼저 최신 상태를 참조하기 위해서이다. 위처럼 직접 상태값에 접근하면 클로저 때문에 보통 기대하는 최신 상태값이 아니라 예전 상태값을 받아오게 될 수도 있다. 그러므로 `get`을 통해 안전하게 Zustand가 보장하는 최신값을 가져올 수 있다.

두 번째 이유는 상태와 메서드의 분리이다. 
직접 상태에 접근하는 대신 `get`을 통해 전달받음으로써 이 메서드가 상태를 직접적으로 가공하지 않고 사용하기만 한다는 것을 드러낼 수도 있고 보장할 수도 있다. 

(GPT는 get을 사용하지 않을 경우 상태 구독이 제대로 업데이트되지 않는 문제도 있다고 하는데, 따로 확인해보지는 않았다. 아마 클로저 문제와 비슷한 이유일 것 같다)

말이 길어졌는데, 코드는 간단하다. 
```jsx
getFilteredTodos: () => {
    const { todos, filter } = get();

    if (filter === "completed"){
	    return todos.filter((todo) => todo.completed);
    }
    if (filter === "incomplete"){
	    return todos.filter((todo) => !todo.completed);
    }
    
    return todos;
},
```
`get`으로 상태를 가져와서 filter 값에 맞게 가공된 todos를 리턴해준다. 

마지막으로 완료/미완료 개수를 세는 함수가 필요한데 getFilteredTodos와 아주 유사하다.
```jsx
getCompletedCount: () => get().todos.filter((todo) => todo.completed).length,
getIncompletCount: () => get().todos.filter((todo) => !todo.completed).length,
```
위에서 했던 필터링을 또 하고 그 배열의 length를 구하는 식이다. 마찬가지로 get을 사용했으므로 항상 최신 상태가 보장된다. 
아무튼 이걸로 투두리스트의 모든 기능 구현을 마쳤다. 

이제 컴포넌트에서 Zustand Store에 열심히 선언한 값들을 사용하면 된다. 
```jsx
import { useTodoStore } from "./store";

const ZTodo = () => {
  const {
    getFilteredTodos,
    addTodo,
    deleteTodo,
    toggleTodo,
    setFilter,
    getCompletedCount,
    getIncompleteCount,
  } = useTodoStore();

  ...
}
```
Store에 선언한 값들을 마치 리액트 훅을 사용하는 것처럼 가져올 수 있다. 

useTodoStore에서 불러온 값이 많은데(컴포넌트 분리를 하지 않은 것도 한몫하겠지만), Zustand 공식 문서에서 간단한 어플리케이션이라면 Single Store를 사용하는 것을 추천하고 있다. 앞서 했던 것처럼 서로 관련된 상태와 메서드들을 한 Store에서 묶어 관리하라는 것이다. 
하지만 규모가 커지고 관리할 상태가 많아진다면 가독성과 성능(리렌더링)을 위해 스토어를 분할하는 것을 권장한다.

#### 미들웨어 사용하기
그러고보니 투두리스트로서의 기능은 전부 만들었지만 "새로고침에도 데이터 유지"는 하지 못했다. 
localstorage를 사용하면서 이와 연동하는 잡다한 코드가 늘어나겠지만...
Zustand에서 제공하는 미들웨어를 통해 아주아주 간단하게 로컬 스토리지와 연동할 수 있다.

바로 `persist`를 사용하면 된다. 첫 번째 인자로 아까 create에 있었던 코드를 넣어주고 두 번째 인자로 localstorage의 key를 명시해주면 된다.
```jsx
export const useTodoStore = create(
  persist(
    (set, get) => ({
      ...
    }),
    { name: "zustand-todo-storage" }
  )
);
```
이렇게만 해 주면 `localstorage.setItem`같은 추가 코드를 작성하지 않아도 Zustand가 알아서 처리해준다. 

(사실 별거 없는 이 내용을 조사한 이유는 Jotai와 달리 외부 상태와 쉽게 연동할 수 있는 Zustand!를 소개하기 위해서였다. 하지만 localstorage 연동 코드가 단순한지라 드라마틱한 효과는 없었고, 무엇보다 Jotai에서도 똑같은 기능을 제공하고 있어서 효과는 없었다...) 


### Jotai로 구현하기
똑같은 기능을 Jotai로 구현해보자!

Jotai는 atomic 패턴을 사용해 상태를 Atom으로 잘게 나눠서 선언한다. Zustand에서는 Single Store 원칙에 따라 하나의 store에서 상태를 관리했지만 Jotai에서는 상태를 각각의 Atom으로 분리해서 사용할 수 있다.

상태 선언은 간단하다. atomKey가 필요했던 Recoil보다 더 간소화된 모습이다.
```jsx
export const todosAtom = atom([]);
export const filterAtom = atom("all");
```
또 Zustand에서는 상태를 선언한 이후, 같은 스토어에서 상태를 이용하기 위한 setter 로직을 정의해줬었다. 하지만 Jotai에서는 컴포넌트에서 알아서 상태를 가공해서 사용한다. 
그러므로 todos를 조작하는 setter 로직은 컴포넌트에서 작성하고 여기서는 todosAtom의 파생 상태인 필터링 상태만 추가로 만들면 된다.

문법은 Zustand와 은근히 유사하다. 다른 Atom 상태에 `get`으로 접근한 뒤 그를 기반으로 한 상태를 만들어주면 된다. 필터링 로직도 똑같다.  
```jsx
export const completedCountAtom = atom(
  (get) => get(todosAtom).filter((todo) => todo.completed).length
);

export const incompleteCountAtom = atom(
  (get) => get(todosAtom).filter((todo) => !todo.completed).length
);
```
Recoil에서는 Selector를 사용해 파생 상태를 관리했지만 Jotai에서는 또다른 Atom을 만들어 사용해야 한다. Recoil을 처음 사용했을 때 Atom과 Selector가 조금 헷갈렸었는데 이렇게 Atom만 사용하는 게 더 직관적인 것 같다.

다음은 필터링된 투두리스트를 상태로 관리하는 코드이다. 여기서 Jotai의 장점이 드러난다.
```jsx
export const filteredTodosAtom = atom((get) => {
  const todos = get(todosAtom);
  const filter = get(filterAtom);

  if (filter === "completed") return todos.filter((todo) => todo.completed);
  if (filter === "incomplete") return todos.filter((todo) => !todo.completed);
  return todos;
});
```
앞선 Zustand 코드에서는 filteredTodos를 상태로 관리하지 않았는데, 여기서는 바로 사용했다. 그 이유는 Jotai가 상태 의존성을 자동으로 추적해 최신 상태를 반영해주고 리렌더링을 트리거하기 때문이다. 

Zustand에서도 filteredTodos를 상태로 사용할 수 있다. 다만 setter 함수를 꼭 선언해야 하고, 의존성이 자동으로 추적되지 않기 때문에 코드를 더 추가해줘야 한다. 

먼저 필터링 기능을 지원하는 함수를 새로 만들고, 투두리스트를 업데이트할 때마다 이 함수를 사용해 todos와 filteredTodos를 업데이트하는 로직을 직접 작성한다. 
```jsx
todos: [],
filter: "all", // all | completed | incomplete
filteredTodos: [], // 새로운 상태 추가


setFilter: (filter) =>
    set((state) => ({
        filter,
        filteredTodos: get().applyFilter(state.todos, filter),
    })),

// 필터 제공 로직 
applyFilter: (todos, filter) => {
    if (filter === "completed") {
        return todos.filter((todo) => todo.completed);
    }
	if (filter === "incomplete") {
        return todos.filter((todo) => !todo.completed);
    }
    
    return todos;
},

addTodo: (text) =>
	set((state) => {
        const newTodos = [
            ...state.todos,
            { id: Date.now(), text, completed: false },
        ];

		// todos와 filteredTodos를 같이 업데이트 
        return {
	        todos: newTodos,
            filteredTodos: get().applyFilter(newTodos, state.filter),
        };
    }),
```
이렇게 todos에 업데이트가 일어날 때마다 명시적으로 filteredTodos 상태를 업데이트해주는 로직을 모든 함수에 달아야 한다. 즉 toggleTodo, deleteTodo 함수에도 마찬가지로 filteredTodos 업데이트 로직이 추가된다. 
반면 Jotai를 사용하면 Zustand와 같은 로직을 사용했음에도 파생 상태를 손쉽게 상태로 관리할 수 있다. 

 
중간에 Zustand 이야기로 넘어갔는데, Jotai와 Zustand를 비교하기 위해서이기도 했지만 Jotai의 setter 로직이 Zustand와 크게 다르지 않기 때문에 미뤄두었다. 

아까 언급한대로 Jotai에서는 사용처에서 상태 setter 로직을 작성한다. 그 점을 제외하면 로직이나 문법이나 Zustand와 비슷하다.
```jsx
const JTodo = () => {
  const setTodos = useSetAtom(todosAtom);
  const setFilter = useSetAtom(filterAtom);
  const [filteredTodos] = useAtom(filteredTodosAtom);
  const [completedCount] = useAtom(completedCountAtom);
  const [incompleteCount] = useAtom(incompleteCountAtom);

  const addTodo = (text) => {
    setTodos((prev) => [...prev, { id: Date.now(), text, completed: false }]);
  };

  const toggleTodo = (id) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

```
다만 filteredTodos라는 파생 상태를 갖고 있음에도 todo를 업데이트하는 함수에서 filteredTodos 상태를 신경쓰지 않고 todo만 업데이트할 수 있다. 

localstorage 연동은 Jotai에서 제공하는 `atomWithStorage`를 이용하면 된다. Zustand의 `persist`와 유사하다.
```jsx
export const todosAtom = atomWithStorage("jotai-todo-storage", []);
export const filterAtom = atomWithStorage("filter", "all"); 
```

***
## 사용 후기 
왜 우테코 미션에서 상태 관리 라이브러리로 Recoil을 사용했는지 조금 이해할 수 있게 됐다. 
Zustand가 Redux에 비해 훨씬 가벼운 라이브러리임에도 불구하고 Flux 패턴 기반이라 개발자가 신경써야 하는 게 더 많았다. 

### Jotai
그런 측면에서 오히려 초보자라면 Jotai가 더 편할 것 같다. 보통 Zustand가 쉽고 단순하다고 하는데, 어떤 느낌으로 간편하다는 것인지는 알겠지만 Jotai를 사용하기 위해 배워야 하는 Atom 개념이 딱히 어렵지는 않아서 차라리 이게 낫지 않을까 싶다. (물론 Atom을 잘 설계하고 장점을 극대화하려면 공부해야겠지만) 특히 React를 닮은 기능이 많아서 React를 아는 사람이라면 사용법을 금방 익힐 수 있다.
빠른 개발이 중요하고, 파생 상태가 많은 로직일 때도 Jotai를 사용할 것 같다. 

### Zustand
앞서 살펴본 코드가 간단한데다 리액트만 사용해서 Zustand의 장점이 잘 드러나지 않았지만 Zustand의 장점도 뚜렷했다. 
먼저 상태와 그 상태를 이용하는 방법을 store에서 한꺼번에 관리 및 확인할 수 있다는 점이 좋은 것 같다. 
Jotai에서는 상태 업데이트를 각 컴포넌트에서 진행하니까 여러 컴포넌트에서 같은 상태를 업데이트하는 로직이 있는 경우에는 모든 경우를 하나하나 다 찾아가면서 흐름을 파악해야 한다. (이 예제에서는 드러나지 않았지만 같은 Atomic 패턴을 사용하는 Recoil의 상태 흐름을 파악할 때 프로젝트 코드를 하나씩 뒤져본 경험이 있다)

또 학생 수준의 프로젝트에서는 여러 프레임워크를 통합하는 환경의 필요성을 느끼기 힘들지만 React-agnostic한 Zustand는 통합 환경을 만들 때 아주 유용하게 사용할 수 있을 것 같다. 

### + 리렌더링?
도 다루고 싶었지만 결국 다루지 못했다... 
둘 다 자신이 구독하는 상태가 바뀌었을 때 리렌더링된다는 점은 같다. 
러프하게는 Jotai가 성능 최적화에 더 유리하다는데, 아무래도 자동화때문인 것 같다. Zustand에서는 개발자가 전부 신경써야 하기 때문이다.
다만 그만큼 Zustand는 자유도가 높고, Jotai는 Atom을 잘못 설계했을 때 리렌더링 이슈가 생긴다고 이해했다. 

***
## 출처
- [Jotai Storage](https://jotai.org/docs/utilities/storage)
- [Zustand Persisting store](https://zustand.docs.pmnd.rs/integrations/persisting-store-data)
- [Zustand Flux Pattern](https://zustand.docs.pmnd.rs/guides/flux-inspired-practice)
- [어떤 상황에서 Zustand와 Jotai를 사용해야 할까](https://velog.io/@clydehan/%EC%96%B4%EB%96%A4-%EC%83%81%ED%99%A9%EC%97%90%EC%84%9C-Zustand%EC%99%80-Jotai%EB%A5%BC-%EC%84%A0%ED%83%9D%ED%95%B4%EC%95%BC-%ED%95%A0%EA%B9%8C)
- [여러 프레임워크에서 사용할 수 있는 라이브러리 만들기](https://toss.tech/article/27746)
