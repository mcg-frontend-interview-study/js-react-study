시작하기에 앞서, 본 글에서 ‘가리킨다’ 라는 의미는 ‘바인딩된다’ 라고 정의하겠습니다. 또한, 모든 예제는 브라우저 환경임을 가정합니다.

## this

- 함수 호출 방식에 따라 자신이 속한 객체나 자신이 생성할 인스턴스를 가리키는 자기 참조 변수거나, 전역 객체를 가리키는 변수.

- 즉, this는 자기 자신을 가리키거나, 전역 객체를 가리킵니다.

```jsx
// 객체 리터럴 예제
// this는 getName 메서드를 호출한 객체인 introduction을 가리킵니다.
const introduction = {
  name: '마루',
  getName() {
    return `${this.name}는 강쥐`;
  },
};

console.log(introduction.getName()); // 마루는 강쥐
```

```jsx
// class 예제
// this는 생성자 함수가 생성한 Introduce 인스턴스를 가리킵니다.
class Introduction {
  name = '마루';

  getName() {
    return `${this.name}는 강쥐`;
  }
}

const i = new Introduction();

console.log(i.getName()); // 마루는 강쥐
```

<br/>

## this 바인딩

그런데 this가 가리키는 값은 **함수 호출 방식**에 의해 달라집니다. 함수를 선언할 때가 아닌, 함수를 호출할 때 어떻게 호출되었는지에 따라 this에 바인딩되는 객체가 동적으로 결정됩니다.

> 렉시컬 스코프(Lexical Scope)는 함수 객체가 **생성**되는 시점에 상위 스코프를 결정합니다. 반면, this 바인딩은 함수 **호출** 시점에 결정됩니다.

<br/>

함수를 호출하는 방식은 다음과 같습니다

```markdown
- 단순하게 함수를 호출하는 경우
- 객체의 메서드로서 함수를 호출하는 경우
- 생성자 함수로 호출하는 경우
- 콜백 함수를 호출하는 경우
- 화살표 함수로 호출하는 경우
- apply/call/bind를 사용하여 호출하는 경우
```

### 1. 단순하게 함수를 호출하는 경우

```jsx
function hi() {
  return console.log(this);
}

// 브라우저
hi(); // window
```

일반적으로 함수를 호출하는 경우 this는 `window`를 가리킵니다.

하지만 예외로 StrictMode에서는 `undefined`를 가리킵니다. 이는 안전한 코드 작성을 돕기 위해 자바스크립트에서 설계된 동작입니다.

```jsx
function hello() {
  'use strict';
  return console.log(this);
}

// 브라우저
hello(); // undefined

window.hello(); // window : window 객체의 메서드나 속성으로 호출하는 경우는 window를 가리킴
```

<br/>

### 2. 객체의 메서드로서 함수를 호출하는 경우

```jsx
const hi = {
  value: 100,
  hello: function () {
    console.log(this); // hi
    console.log(this.value); // 100
  },
};

hi.hello();
```

함수를 객체의 메서드로 호출하면 this는 메서드를 호출한 객체를 가리킵니다.

<br/>

```jsx
const obj1 = {
  name: 'Lee',
  sayName: function () {
    console.log(this.name);
  },
};

const obj2 = {
  name: 'Kim',
};

obj2.sayName = obj1.sayName;

obj1.sayName(); // Lee
obj2.sayName(); // Kim
```

위 예제를 살펴보면, `obj2`의 sayName은 `obj1`의 sayName을 참조하도록 작성되었습니다. 하지만 호출하는 주체는 `obj2`이기 때문에 this는 `obj2`를 가리키며, 결과적으로 Kim이 출력됩니다.

쉽게 말하자면, 메서드를 호출한 경우 this는 메서드 앞에 있는 객체(obj1 또는 obj2)를 가리킨다고 할 수 있습니다.

<br/>

### 3. 생성자 함수로 호출하는 경우

`new` 키워드로 함수를 호출하는 경우 생성자 함수로 동작하는데요, 이 경우 this는 `new` 키워드로 생성될 인스턴스를 가리킵니다.

```jsx
function Hi(name) {
  this.name = name;
}

const hi = new Hi('Lee');
console.log(hi); // Hi 인스턴스
console.log(hi.name); // Lee
```

<br/>

### 4. 콜백 함수를 호출하는 경우

```jsx
const user = {
  name: 'Default',
  setName: function (newName) {
    this.name = newName;
  },
};

function getUserName(newName, callback) {
  callback(newName);
}

getUserName('Lee', user.setName);

console.log(user.name); // Default
console.log(window.name); // Lee
```

`getUserName` 을 통해 `user.setName` 을 호출하고 있습니다. 예상으로는 `user.name`인 ‘Default’가 ‘Lee’로 변경될 것 같은데요, 하지만 `user.name` 은 변경되지 않고 `window.name` 속성이 추가되어 `Lee` 로 할당되었습니다.

이는 `getUserName` 이 호출될 때, `user.setName` 의 함수 참조만 `callback` 으로 전달됩니다. 따라서 `callback` 은 **일반 함수를 호출**하는 것이라고 생각할 수 있는 것이죠.

그 결과 callback으로 실행된 `user.setName` 의 this는 window를 가리키게 되고, window의 name 속성이 Lee로 할당됩니다.

이를 해결하려면, 이후에 나올 `apply, call, bind` 로 this를 명시적으로 바인딩하는 방법을 참고할 수 있습니다. 자세한 설명은 해당 부분에서 알려드리겠습니다.

```jsx
const user = {
  name: 'Default',
  setName: function (newName) {
    this.name = newName;
  },
};

function getUserName(newName, callback) {
  callback(newName);
}

// 방법1
getUserName('Lee', user.setName.bind(user));

// 방법2
getUserName('Lee', function (newName) {
  user.setName.call(user, newName);
});

// 방법3
getUserName('Lee', function (newName) {
  user.setName.apply(user, [newName]);
});

console.log(user.name); // Lee
console.log(window.name); // 공백 출력 (전역 객체에서 name 속성이 정의되지 않음)
```

<br/>

### 5. 화살표 함수로 호출하는 경우

2번 `객체의 메서드로서 함수를 호출하는 경우` 의 예제로 메서드 내부에서 함수를 호출하는 경우를 다뤘는데요,

```jsx
const hi = {
  value: 100,
  hello: function () {
    function foo() {
      console.log(this); // window
    }
    foo();
  },
};

hi.hello();
```

이 경우처럼 일반 함수로 호출하는 경우 this는 window를 가리킵니다.

하지만 메서드 내부의 일반 함수를 화살표 함수로 바꾸면 어떻게 될까요?

```jsx
const hi = {
  value: 100,
  hello: function () {
    const foo = () => {
      console.log(this); // hi
    };
    foo();
  },
};

hi.hello();
```

화살표 함수를 사용하면 this는 window가 아닌 hi 객체를 가리킵니다.

화살표 함수에는 this 개념이 존재하지 않기 때문인데요, 위 코드의 `foo` 에서 this를 출력하고 있긴 하지만 이 this는 스코프 체인에 따라 상위로 올라가다 `hi.hello` 에서 발견한 this와 같다고 생각하면 됩니다.

function 키워드를 통해 선언된 함수는 호출 시점에 따라 동적으로 this가 가리키는 값이 결정되지만, 화살표 함수는 this가 가리키는 값이 선언되는 시점에서의 상위 스코프로 결정됩니다.

따라서 전역에서 화살표 함수로 this를 사용하는 경우, this는 window를 가리킵니다.

```jsx
const hi = () => console.log(this);
hi(); // window
```

<br/>

### 6. apply/call/bind를 사용하여 호출하는 경우

apply, call, bind 모두 this를 연결하는 역할을 합니다.

```jsx
func.apply(thisArg, [argsArray])
func.call(thisArg, args1, args2, ...)
func.bind(thisArg)(argsArray)
```

- apply는 두 번째 인자로 배열을 받지만, call은 두 번째 인자부터 값을 쉼표로 구분하여 전달합니다.
- apply와 call은 함수를 즉시 실행시키지만, bind는 실행시키지 않아 `func.bind(thisArg)` 뒤에 ()를 붙여 함수를 실행시킵니다.

<br/>

- apply

  ```jsx
  function hello() {
    console.log(this); // window
  }

  hello();
  ```

  일반 함수에서의 this는 window지만, apply를 결합하면 객체가 연결됩니다.

  ```jsx
  const hi = { name: 'Lee' };

  function hello() {
    console.log(this); // hi
  }

  hello.apply(hi);
  ```

  apply에서 배열로 넘겨준 인자는 개별 인자로 사용됩니다.

  ```jsx
  const hi = { name: 'Lee' };

  function hello(arg1, arg2, arg3) {
    console.log(arg1); // 1
    console.log(arg2); // 2
    console.log(arg3); // 3
  }

  hello.apply(hi, [1, 2, 3]);
  ```

- call

  call도 apply와 동일하지만, 인자를 넘겨주는 방식에 차이가 있습니다.

  ```jsx
  const hi = { name: 'Lee' };

  function hello(arg1, arg2, arg3) {
    console.log(arg1);
    console.log(arg2);
    console.log(arg3);
  }

  hello.call(hi, 1, 2, 3);
  ```

  인자를 배열로 넘겨주는 것이 아닌, 개별 인자 값으로 넘겨줍니다.

- bind
  apply와 call과는 다르게, 함수를 직접 실행시켜주어야 합니다.

  ```jsx
  const hi = { name: 'Lee' };

  function hello() {
    console.log(this); // hi
  }

  hello.bind(hi)();
  ```

  익명함수 형태로도 사용 가능합니다. 이 경우 bind의 위치가 달라집니다.

  ```jsx
  const hi = { name: 'Lee' };

  const hello = function () {
    console.log(this); // hi
  }.bind(hi);

  hello();
  ```

  인자를 넘겨주는 방식은 call과 동일합니다.

  ```jsx
  const hi = { name: 'Lee' };

  function hello(arg1, arg2, arg3) {
    console.log(arg1); // 1
    console.log(arg2); // 2
    console.log(arg3); // 3
  }

  hello.bind(hi)(1, 2, 3);
  ```

<br/>
<br/>

## 총정리

1. this는 런타임에 결정됩니다.
2. 일반 함수 호출에서의 this는 모두 전역 객체를 가리킵니다. (StrictMode에서는 undefined)
3. 메서드로 호출하면 this는 메서드로 호출한 객체를 가리킵니다. (. 바로 앞의 객체)
4. 생성자 함수 호출 시 this는 생성자 함수가 생성할 인스턴스를 가리킵니다.
5. 화살표 함수는 자신만의 this를 가지지 않고, 스코프 체인에 따라 this를 가져옵니다.

<br/>
<br/>

## Quiz

1. 아래 코드의 출력 결과는?

```jsx
var value = 10;

const hi = {
  value: 100,
  hello: function () {
    console.log(this.value); // 1번
    function foo() {
      console.log('내부 함수', this.value); // 2번
    }
    foo();
  },
};

hi.hello();
```

<details>
<summary>
정답
</summary>
<div markdown="1">
1번 : 100

2번 : 10

</div>
</details>
<br/><br/>
2. 아래 코드의 출력 결과는?

```jsx
const obj1 = {
  foo: function () {
    console.log(this); // 1번
    const bar = function () {
      console.log(this);
    };
    bar(); // 2번

    const obj2 = {
      obj2Method: bar,
    };
    obj2.obj2Method(); // 3번
  },
};

obj1.foo();
```

<details>
<summary>
정답
</summary>
<div markdown="1">

```jsx
const obj1 = {
  foo: function () {
    console.log(this); // 1번 : obj1
    const bar = function () {
      console.log(this);
    };
    bar(); // 2번 : window

    const obj2 = {
      obj2Method: bar,
    };
    obj2.obj2Method(); // 3번 : obj2
  },
};

obj1.foo();
```

1번 : `obj1.foo()` ⇒ 메서드로 실행되어 . 앞의 객체인 obj1를 가리킵니다.

2번 : 일반 함수로 실행되어 window를 가리킵니다.

3번 : `obj2.obj2Method()` ⇒ 메서드로 실행되어 . 앞의 객체인 obj2를 가리킵니다.

</div>
</details>
<br/><br/>

3. setTimeout으로 함수가 호출되는 경우 this는 무엇을 가리킬까요?

```jsx
const hi = {
  value: 100,
  hello: function () {
    setTimeout(function () {
      console.log(this);
    }, 100);
  },
};

hi.hello();
```

<details>
<summary>
정답
</summary>
<div markdown="1">

```jsx
const hi = {
  value: 100,
  hello: function () {
    setTimeout(function () {
      console.log(this); // window
    }, 100);
  },
};

hi.hello();
```

함수가 일반 함수로 호출되어 window를 가리키기 때문입니다. (StrictMode에서는 undefined)

</div>
</details>

<br/><br/> 4. 막간을 이용한 자바스크립트 확장 퀴즈) 내부 함수와 대기 시간이 0초로 설정된 setTimeout의 콜백 함수가 있을 때, 내부 함수가 setTimeout보다 뒤에 실행된다고 할 때 출력값과 출력 순서는?

```jsx
var value = 10;

const hi = {
  value: 100,
  hello: function () {
    console.log(this.value); // 1번
    function foo() {
      console.log(this.value); // 2번
    }
    setTimeout(function () {
      console.log(this.value); // 3번
    }, 0);
    foo();
  },
};

hi.hello();
```

<details>
<summary>
정답
</summary>
<div markdown="1">
  1번, 100
  
  2번, 10
  
  3번, 10
  
  setTimeout의 콜백 함수는 매크로 태스크 큐에 들어가 나중에 실행됩니다.
</div>
</details>

<br/><br/> 5. 100을 출력하기 위해서 아래 코드를 수정해 보세요. (정답 2개)

```jsx
const hi = {
  value: 100,
  hello: function () {
    function foo() {
      console.log(this.value); // 100
    }
    foo();
  },
};

hi.hello();
```

<details>
<summary>
정답
</summary>
<div markdown="1">
  1. hi를 바인딩하는 this 변수 추가
   
  ```jsx
  const hi = {
    value: 100,
    hello: function () {
      const that = this;
      function foo() {
        console.log(that.value); // 100
      }
      foo();
    },
  };

hi.hello();

````

`hello` 메서드 내부에서의 this는 `hi`를 가리키므로 `that`에 this를 할당하면 내부 함수 `foo`에서 100이 출력됩니다.

<br/>

2. `call` , `apply`, `bind` 메서드에 의한 간접 호출

```jsx
const hi = {
  value: 100,
  hello: function () {
    function foo() {
      console.log(this.value); // 100
    }
    foo.call(this);
  },
};

hi.hello();
````

```jsx
const hi = {
  value: 100,
  hello: function () {
    function foo() {
      console.log(this.value); // 100
    }
    foo.apply(this);
  },
};

hi.hello();
```

```jsx
const hi = {
  value: 100,
  hello: function () {
    function foo() {
      console.log(this.value); // 100
    }
    foo.bind(this)();
  },
};

hi.hello();
```

```jsx
// 아래 코드도 가능

const hi = {
  value: 100,
  hello: function () {
    const foo = function () {
      console.log(this.value); // 100
    }.bind(this);
    foo();
  },
};

hi.hello();
```

- call와 apply같은 경우 함수를 호출하지만, bind는 함수를 호출하지 않아 foo 함수를 실행시켜주어야 합니다.
</div>
</details>

<br/><br/><br/>

**참고 자료**

모던 자바스크립트 22장 this

코어 자바스크립트 3장 this

[MDN - this](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Operators/this)

[[JS] 📚 자바스크립트 this 💯 완전 정복](https://inpa.tistory.com/entry/JS-%F0%9F%93%9A-this-%EC%B4%9D%EC%A0%95%EB%A6%AC)

[[JavaScript] 화살표 함수와 this 바인딩](https://velog.io/@padoling/JavaScript-%ED%99%94%EC%82%B4%ED%91%9C-%ED%95%A8%EC%88%98%EC%99%80-this-%EB%B0%94%EC%9D%B8%EB%94%A9)
