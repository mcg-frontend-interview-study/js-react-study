# [WEEK_1] prototype-and-example

# JS가 프로토타입을 선택하게된 이유

JS의 개발자 브랜든 아이크는 넷스케이프라는 회사에 다니고 있었습니다. 넷스케이프는 웹 브라우저를 개발하는 회사로 그 당시 다양한 브라우저 사이에서 치열한 경쟁을 하고 있었습니다. 

또한 이 시기에 넷스케이프와 JAVA를 만든 회사인 썬 마이크로시스템즈와 협력관계가 되었는데요. 이때 윈도우는 비주얼 C++과 비주얼 베이직이라는 고수용, 초보자용 언어를 내세워 홍보하고 있었습니다. 그래서 이런 인기에 편승하고자 넷스케이프는 마침 자바와 함께하게 되었으니 자바를 고수용 언어로 하고 초보자용 언어를 만들어 윈도우처럼 고수용, 초보용 언어를 만들어 대응하기로 결정했습니다.

그때의 웹은 정적 콘텐츠 중심이었기 때문에 넷스케이프는 브라우저 시장에서 살아남기 위한 경쟁력으로 동적인 컨텐츠를 제공하려는 시도가 있었습니다. 그리고 이를 위헤 웹 브라우저에서 사용할 수 있는 언어가 필요했습니다.

JAVA를 그대로 사용하기에는 무겁고, 클래스라는 개념은 빠르게 배우기 어려웠기 때문에 가볍고 배우기 쉬운 언어를 만들어야 했습니다. 이 언어는 전문 프로그래머가 아니라 디자이너나 초보 프로그래머를 타겟으로 합니다.

다만 홍보가 잘 되기 위해선 JAVA와 비슷하지만 배우기 쉬운 언어여야 했으며, JAVA와 비슷하게 보이기 위해 객체(클래스)를 구현할 수 있어야 한다는게 새 언어의 요구 사항이었습니다.

정리하자면 브랜든 아이크는 다음과 같은 요구사항을 만족하는 새 언어를 개발해야했던거죠.

> 배우기 쉬우며, JAVA와 비슷하게 클래스를 사용할 수 있어야 하고, 동적인 웹 브라우저를 만들 수 있어야 함
> 

그래서 클래스를 구현할 수 있지만 배우기 쉬운 프로토타입 개념을 선택하여 새 언어인 Javascript를 만들게 되었습니다.

# 프로토타입 기반 언어로 클래스의 상속을 구현하는 방법

js에서는 클래스의 상속이 프로토타입 체인이라는 개념으로 구현됩니다. 우리가 배열 메서드같은 것을 사용할 수 있는 이유도 이 프로토타입 체인으로 구현된 상속을 통해서 가능한 것이죠.

프로토타입 체인은 스코프 체인과 아주 유사한 개념으로, 접근하려는 프로퍼티나 메서드가 현재 객체에 없을 경우 체인을 타고 올라가 끝에 닿을 때 까지 찾아나가는 개념을 말합니다.

![스코프 체인](https://img.notionusercontent.com/s3/prod-files-secure%2Fc555b800-3d36-4850-a05e-6e09cff98885%2F43693c4d-3362-44b5-9ce5-9e8017f3d2a5%2F9707d1ee-f1f6-4539-be6c-8e103a987414.png/size/w=1870?exp=1735277826&sig=lF4mR9l6DAT1QKYxarupe8LJCXiHT2ssDac16L9ZHXc)


스코프 체인

스코프 체인에서는 이런 체이닝을 위해 Lexical Environment(Variable Env도 맞음)라는 객체를 사용하고 있습니다. 이 안에는 `내 안에 어떤 식별자들이 있는지(record)` 그리고 `나의 밖 스코프는 누구인지(outer)` 를 저장하고 있습니다.

프로토타입 체인은 스코프 체인과 매우 유사하다고 말씀드렸죠. Lexical Environment와 대응되는 프로토타입 객체가 있습니다.

이 프로토타입 객체는 `내 안에 어떤 메서드, 필드가 있는지` 그리고 `나의 부모(상속 주체)는 누구인지` 를 저장하고 있습니다. 

이 나의 부모(상속 주체)는 누구인지를 저장하는게 체이닝을 만들게 되는데요! Animal이라는 클래스를 상속한 Dog클래스가 있고 이 Dog클래스로 누렁이 인스턴스를 만들었을 경우 아래처럼 계속해서 위로 올라가는 체이닝이 만들어지게 되어요.

![IMG_2797.HEIC](https://img.notionusercontent.com/s3/prod-files-secure%2Fc555b800-3d36-4850-a05e-6e09cff98885%2F20a5095a-07bf-425e-adc5-c2fd566c59cc%2F71377aa4-aaef-48ca-accc-2d4be3317572.png/size/w=1870?exp=1735277849&sig=e0l-Ypy-QN0KHAnHYyiSej4-dDvEZog8zhKUuwFfGl8)

스코프 체인과 비슷하죠?

이제 어느정도 개념을 알게 되었으니 실제 코드, 출력 결과, 내부 모습을 더 구체적으로 알아볼게요. Animal 클래스와 이 클래스를 상속하는 Dog 클래스, 그리고 Dog 클래스의 인스턴스인 누렁이 인스턴스를 만들어보겠습니다 

```jsx
class Animal {
	eat() {
		console.log('냠냠')
	}
}

class Dog extends Animal {
	bark() {
		console.log('멍멍')
	}
}

const 누렁이 = new Dog()
```

이들의 프로토타입 체인은 실제로 어떤 모습일까요?

![image.png](https://img.notionusercontent.com/s3/prod-files-secure%2Fc555b800-3d36-4850-a05e-6e09cff98885%2F9153675f-30f3-45f6-be5b-1166695c0473%2Fimage.png/size/w=1870?exp=1735277869&sig=XyUwTavrtoMslNaYH9shwj3KgjTMbXHnuuF186b4PEQ)

일단 프로토타입 체인은 프로토타입 객체가 연결된 형태입니다. 하나의 프로토타입 객체 안에는 constructor와 [[prototype]] 프로퍼티가 있는데요.

constructor 프로퍼티를 알기 위해선 프로토타입 객체는 항상 생성자 함수와 쌍을 이룬다는 알면 이해할 수 있습니다. 

> 생성자 함수는 간단하게 말하면 `new 뭐시기()` 처럼 사용할 수 있는 클래스를 말해요~!
> 

![image.png](https://img.notionusercontent.com/s3/prod-files-secure%2Fc555b800-3d36-4850-a05e-6e09cff98885%2F0327614e-58ee-421b-b3af-f2f424f84949%2Fimage.png/size/w=1870?exp=1735277884&sig=_57nbZqOs5iUKmeV-FnP1HemTZRx3Jqq5bT1yhd5S8s)

쌍을 이루기 위해 서로를 바라보는 프로퍼티를 갖습니다. 프로토타입 객체는 constructor필드로 생성자 함수를 가리키고, 생성자 함수의 prototype은 프로토 타입 객체를 가리키죠.

![image.png](https://img.notionusercontent.com/s3/prod-files-secure%2Fc555b800-3d36-4850-a05e-6e09cff98885%2F453c95e1-08a8-4010-97e3-5a101acebfd5%2Fimage.png/size/w=1870?exp=1735277926&sig=I8QqxHjEXjtUT8hiXgTNLtkbCZoMD7WbvoIz_s8Ivp8)

프로토타입 객체의 [[prototype]] 프로퍼티는 자신의 상속 주체를 가리킵니다. 프로토타입은 체인이기 때문에 프로토타입 객체의 상속 주체는 상속받은 생성자 함수의 프로토타입 객체를 가리킵니다. 생성자 함수를 가리키는게 아닙니다. Lexical environment가 상위 스코프의 Lexical environment를 가리키는 것처럼 프로토타입 객체도 상속 주체의 프로토타입 객체를 가리키는 것입니다. 

Dog는 Animal 클래스를 상속받아 만들어지기 때문에 Dog 프로토타입 객체의 [[prototype]]은 Animal 프로토타입을 가리킨다는 뜻입니다.

![image.png](https://img.notionusercontent.com/s3/prod-files-secure%2Fc555b800-3d36-4850-a05e-6e09cff98885%2F962a8211-0471-47a4-93a2-f698d0559b36%2Fimage.png/size/w=1870?exp=1735277937&sig=V8_WxRp9ozfPwKjtihKL5OoKiN1Tyo0Ug9eGFhSvsyw)

이렇게 프로토타입 객체에 포함된 두 개의 프로퍼티인 constructor와 [[prototype]]가 각각 무엇을 가리키고 있는지 알게되었습니다.

그런데 생성자 함수에도 똑같은 프로퍼티인 [[prototype]]이 있죠. 이 친구는 무엇을 가리킬까요? 프로토타입 객체가 [[prototype]]으로 상속 주체의 프로토타입 객체를 가리키는 것처럼, 생성자 함수도 [[prototype]]를 통해 상속 주체의 생성자 함수를 가리킵니다.

![image.png](https://img.notionusercontent.com/s3/prod-files-secure%2Fc555b800-3d36-4850-a05e-6e09cff98885%2F874af516-adeb-4ec0-9fbb-d99d6fe9e6cb%2Fimage.png/size/w=1870?exp=1735277952&sig=-JP7RGflJqh6qc2AcUGBGG28CyYN437MWaQhsccn_Gg)

요약하자면 다음과 같습니다.

1. 생성자 함수의 prototype = 자신의 짝꿍인 프로토타입 객체
2. 생성자 함수의 [[prototype]] = 자신의 상속 주체의 생성자 함수
3. 프로토타입 객체의 constructor = 자신의 짝꿍인 생성자 함수
4. 프로토타입 객체의 [[prototype]] =  자신의 상속 주체의 프로토타입 객체
- 실제로 출력 결과를 눈으로 확인해보고 싶다면?
    
    ```jsx
    // 생성자 함수는 이름 그대로
    console.log(Dog)
    
    // 프로토타입 객체는 생성자 함수.prototype
    console.log(Dog.prototype)
    
    // [[prototype]] 필드는 `__proto__` 라는 이름을 통해 접근
    console.log(Dog.prototype.__proto__) // Dog 프로토타입 객체의 [[prototype]]
    console.log(Dog.__proto__) // Dog 생성자 함수의 [[prototype]]
    console.log(누렁이.__proto__) // 누렁이 인스턴스의 [[prototype]]
    ```
    
    위 출력 방법을 기반으로 지금까지 나온 결과를 출력해보자면..
    
    ![다이어그램에 보이는 화살표들을 잘 이해했다면 출력 결과가 당연하다고 느껴지실 거에요.](https://img.notionusercontent.com/s3/prod-files-secure%2Fc555b800-3d36-4850-a05e-6e09cff98885%2Fa2408f95-e878-4757-8f18-8c9d8a7a19bf%2Fimage.png/size/w=1870?exp=1735277973&sig=DvNKkT29CwhssfmM2PdNAc4J7c24YfDct76YDu77rg8)
    
    다이어그램에 보이는 화살표들을 잘 이해했다면 출력 결과가 당연하다고 느껴지실 거에요.
    

그러면 아까 보여드렸던 예시 코드의 전체 프로토타입 체인 모습을 완성시켜 보겠습니다.

```jsx
class Animal {
	eat() {
		console.log('냠냠')
	}
}

class Dog extends Animal {
	bark() {
		console.log('멍멍')
	}
}

const 누렁이 = new Dog()
```

누렁이는 생성자 함수인 Dog를 이용해 만들어진 인스턴스 입니다(new 클래스명() = 생성자 함수로 인스턴스 생성 문법). 그러면 이 누렁이도 프로토타입 체인에 연결이 되어야 할텐데요. 누렁이는 생성자 함수가 아니기 떄문에 프로토타입 객체가 없습니다. 따라서 아래 이미지처럼 체인의 시작인 [[prototype]] 프로퍼티만 가진 채로 인스턴스가 만들어지게 됩니다.

![image.png](https://img.notionusercontent.com/s3/prod-files-secure%2Fc555b800-3d36-4850-a05e-6e09cff98885%2F062b0e46-2167-4203-86c5-9de51fa62dca%2Fimage.png/size/w=1870?exp=1735277985&sig=5XfPdIYYxKbDH4D2HwBVo-_cX3_MhlxbR0Zigq4mujs)

그러면 이 누렁이 인스턴스의 [[prototype]]이 무엇을 가리키고 있을까요? 생성자 함수와 프로토타입 객체 중 어느 것을 가리킬까요?

이를 답변하기 위해선 실제로 클래스의 필드나 메서드가 어디에 저장되어있는지 알면 바로 알 수 있습니다(사실 앞에서 말했지만).클래스의 메서드는 생성자 함수가 아닌 프로토타입 객체에 저장됩니다. 프로토타입 체인을 통해 빠르게 접근하기 위해서요. 프로토타입 체인을 구성하는 프로토타입 객체에 필드와 메서드를 저장해놓으면 타고 올라가면서 빠르게 확인할 수 있겠죠. 

생성자 함수에 저장해놓으면 프로토 타입 객체.constructor를 한번 거쳐가야 하죠.

그래서 인스턴스의 [[prototype]] 은 프로토타입 객체를 가리키게 됩니다.

![image.png](https://img.notionusercontent.com/s3/prod-files-secure%2Fc555b800-3d36-4850-a05e-6e09cff98885%2F797a76f3-f67e-46de-8536-575f25429b19%2Fimage.png/size/w=1870?exp=1735277997&sig=m66FbRzzZTTJEo6e9maBDjLtAWaT0dYijv8MA0kPJnQ)

- 출력 결과
    
    ![image.png](https://img.notionusercontent.com/s3/prod-files-secure%2Fc555b800-3d36-4850-a05e-6e09cff98885%2F19db79d9-9f49-4fe6-b94c-77c09c7df797%2Fimage.png/size/w=1870?exp=1735278011&sig=unx6D5SgHGddz45LTrDmadyZdy5zq7G3Wj7T1Re5_A0)
    

Animal 부분을 빼면 익숙한 그림이죠. 

![많이 봤던 이 그림](https://img.notionusercontent.com/s3/prod-files-secure%2Fc555b800-3d36-4850-a05e-6e09cff98885%2F0ba8ed8c-e010-455d-a430-60b5e9d92857%2Fimage.png/size/w=1870?exp=1735278023&sig=rTNMY5BTFoW0PQdP5UdXpG6i4RxH-NM04-J93v-3-Dg)

많이 봤던 이 그림

사실 제가 만든 다이어그램은 프로토타입 객체 안에 있는 필드와 메서드가 생략된 그림으로 실제 모습은 아래와 같아요!  (코드가 기억 안날까봐) Animal 클래스는 eat 메서드가 있었고, Dog 클래스는 bark 메서드를 갖고있었습니다.

![image.png](https://img.notionusercontent.com/s3/prod-files-secure%2Fc555b800-3d36-4850-a05e-6e09cff98885%2F612bad2d-5b3e-49ae-807a-a8e03c8b81a9%2Fimage.png/size/w=1870?exp=1735278035&sig=WaMqBzHTiVaJb1TAdQGsgq0soaVVLTZEGj_lKCd7MME)

메서드는 생성자 함수가 아닌 프로토타입 객체 안에 저장되어 있는걸 볼 수 있어요.

- 출력 결과
    
    
    ![image.png](https://img.notionusercontent.com/s3/prod-files-secure%2Fc555b800-3d36-4850-a05e-6e09cff98885%2F5997e523-774e-44b6-a3e1-7a466d06f2b3%2Fimage.png/size/w=1870?exp=1735278093&sig=65-QOaQ4-jRMUg2OQc764DHVPRKWIBfLCfQF5dXzPp0)
    
    ![image.png](https://img.notionusercontent.com/s3/prod-files-secure%2Fc555b800-3d36-4850-a05e-6e09cff98885%2F49588234-4ae7-43e0-a815-e191e8b192b6%2Fimage.png/size/w=1870?exp=1735278104&sig=PbLF82rtLwbtEXARGvDnGP9Ppe_eDExXLaJB-4QhVxU)
    

끝까지 프로토타입 체인 그림을 완성해볼게요. 

Animal에 대해서도 생각해봅시다. Animal 생성자 함수의 prototype과 Animal 프로토타입 객체의 constructor는 누굴 가리킬지 바로 알 수 있죠.

![image.png](https://img.notionusercontent.com/s3/prod-files-secure%2Fc555b800-3d36-4850-a05e-6e09cff98885%2F46fd5fc3-b1aa-46df-829d-d3d032c6399b%2Fimage.png/size/w=1870?exp=1735278047&sig=q4eGlZpd7kBJS3tV5kr-EGYXXxsPwDVsRGhMrvlL07g)

서로의 짝꿍을 가리키고 있습니다..

- 출력 결과
    
    ![image.png](https://img.notionusercontent.com/s3/prod-files-secure%2Fc555b800-3d36-4850-a05e-6e09cff98885%2F4c4531ff-3c5a-45c6-81f8-79f51c977ebe%2Fimage.png/size/w=1870?exp=1735278120&sig=k33kLJmDHItBaj7O2E52tL4WGF_r6GmvbAakAa1Gwic)
    

그러면 각자의 [[prototype]]은 무엇을 가리키고 있을까요? Animal 생성자 함수부터 생각해보면 extends한게 없어요. 그냥 생 클래스입니다. 그래서 상속 주체가 누군지 알송달송 합니다.

Animal 생성자 함수의 본질은 무엇인가 생각해보면 좋은데요. 생성자 함수도 함수입니다. 그리고 js에서 모든 함수는 Function 생성자 함수의 인스턴스입니다. (Object, Number처럼 Function이라는 생성자 함수도 있어요) 

class 문법은 사실 아래 함수 선언식이 실제 모습입니다. class라는 키워드를 사용하는건 전통적인 프로그래밍 언어를 선호하는 사람들의 니즈로 인해 탄생한 문법적 설탕이에요.

```jsx
// 1
class A {
	constructor (name) {
		this.name = name
	}
}

// 2
function A (name) {
	this.name = name
}
```

클래스는 사실 함수가 실제 모습이고,

그래서 Animal 생성자 함수는 함수이며, 함수는 Function 생성자 함수의 인스턴스임을 알게되었습니다. 그리고 인스턴스의 [[prototype]]은 프로토타입 체인에 연결되기 위해 상속 주체의 프로토타입 객체를 가리킨다고 했습니다. 두 단서를 합치게 되면..

Animal 생성자 함수의 [[prototype]]은 Function 프로토타입 객체를 가리키죠.

![image.png](https://img.notionusercontent.com/s3/prod-files-secure%2Fc555b800-3d36-4850-a05e-6e09cff98885%2Fe340e30f-c874-47e4-b5d7-3219339afe11%2Fimage.png/size/w=1870?exp=1735278130&sig=Ao8OPJMBF815b-XuFTvjvK4amwJP-sOme1am_WI5aM8)

- 출력 결과
    
    ![image.png](https://img.notionusercontent.com/s3/prod-files-secure%2Fc555b800-3d36-4850-a05e-6e09cff98885%2F079929bc-af13-452e-989b-6861fe65bba8%2Fimage.png/size/w=1870?exp=1735278148&sig=5OF9GuOjucIWnOhJrRiTNHeKgBWtZDk1uvOu10owYaY)
    

이어서 Animal 프로토타입 객체의 [[prototype]]은 무엇을 가리킬까요? Animal이 extends를 하고 있지 않기 때문에 어렵죠.

Animal 생성자 함수의 [[prototype]]을 생각해냈던 방식 똑같이 가면 됩니다. 프로토타입 객체는 본질이 무엇일까요? 

이름에 나와있죠. 바로 객체입니다. js의 모든 객체는 Object 생성자 함수의 인스턴스이죠. 그럼 프로토타입 객체는 Object 생성자 함수로 만들어진 인스턴스이겠네요. 

![image.png](https://img.notionusercontent.com/s3/prod-files-secure%2Fc555b800-3d36-4850-a05e-6e09cff98885%2F33f446c5-55fb-4119-ab86-fd9d02b2b3e4%2Fimage.png/size/w=1870?exp=1735278163&sig=0t0X__zGu1-LAIxUjMfhxlH3dTcZns6RPXGsBS-3pwM)

- 출력 결과
    
    ![image.png](https://img.notionusercontent.com/s3/prod-files-secure%2Fc555b800-3d36-4850-a05e-6e09cff98885%2F66acf539-c0d0-474a-a227-405a361abbc9%2Fimage.png/size/w=1870?exp=1735278177&sig=gFOy5hHpQeeeM_WR9Xz4W4qCjOIqiV_oEfpq3p27kug)
    

이제 Animal까지 모든 프로퍼티가 가리키는 것들을 알게 되었습니다.

남은 것은 Function과 Object이네요.

이제 계속 해보았으니 금방 각 프로퍼티가 무엇을 가리키는지 파악할 수 있겠죠. 남은 것들은 

1. Function 프로토타입 객체의 [[prototype]]
2. Function 생성자 함수의 [[prototype]]
3. Object 프로토타입 객체의 [[prototype]]
4. Object 생성자 함수의 [[prototype]]

가장 쉬운 것부터 보자면 Function 프로토타입 역시 객체이기 때문에 Object 프로토타입 객체를 가리킵니다.

그리고 js의 참조형 자료형의 상속 최종 조상은 Obejct에서 끝이 납니다. 프로토타입 체인의 가장 끝은 Object 프로토타입 객체라는 뜻입니다. 그래서 끝을 알려주기 위해 Object 프로토타입 객체의 [[prototype]]는 null입니다. 스코프 체인에서 outer의 끝인 글로벌 환경의 outer는 null인 것처럼요. 둘이 참 비슷하죠

![image.png](https://img.notionusercontent.com/s3/prod-files-secure%2Fc555b800-3d36-4850-a05e-6e09cff98885%2Fab60acdf-d973-4a71-bbd4-aeefb084b4ab%2Fimage.png/size/w=1870?exp=1735278190&sig=9Njk8nep3ulfNx_j_CDlU8sJGGj_NruRa46WUD4Vzwg)

남은 것은 각 생성자 함수의 [[prototype]]인데요. native code라고 뜨고 뭐가 뜨지 않아요. 

![image.png](https://img.notionusercontent.com/s3/prod-files-secure%2Fc555b800-3d36-4850-a05e-6e09cff98885%2Fe9504c72-8faf-4749-b321-67bfb672d568%2Fimage.png/size/w=1870?exp=1735278204&sig=Trv3ED2j5H0xn9ndE6U_vJWKovoRM5m7KS2mFtTyp8I)

공식 문서에서는 “Everything is either an object (instance) or a function (constructor)” 라고 하는걸 보니 Object와 Function은 종점이라 뭘 볼 수 없나 봅니다. (사실 함수도 일급 객체니까 Function 생성자 함수의 [[prototype]] 이 Object 프로토타입 객체일 줄 알았어요)

그리고 저 값들이 어떤 객체를 참조하고 있다고 하면 js를 사용하며 불필요한 메서드나 필드까지 노출되기 때문에 막아놓은 것이라고 추측되어요.

아무튼 결론적으로 체인의 모습은 다음과 같습니다.

![image.png](https://img.notionusercontent.com/s3/prod-files-secure%2Fc555b800-3d36-4850-a05e-6e09cff98885%2F837c3a12-3118-4fe1-ba85-0e363baa09a6%2Fimage.png/size/w=1870?exp=1735278215&sig=5xEdEZzwbHpZIwhtAFdds0yQwbGL1lTKblBK9bR8WyU)

이제 여러분들은 프로토타입 체인이 어떻게 구성되는지 알게 되었습니다. 클래스의 메서드나 필드는 프로토타입 객체 안에 저장되고 객체들은 [[prototype]] 프로퍼티로 프로토타입 체인을 타고 올라가며 상위 메서드, 필드에 접근할 수 있죠. 그렇기 때문에 클래스가 아닌 프로토타입 기반 언어인 JS에서도 상속이라는 개념을 프로토타입 체인을 통해 만들어낼 수 있던 것입니다.

# 프로토타입 객체를 이용하는 instanceof의 구현 원리

고생많으셨습니다. 이제 앞에서 공부했던 것들을 실제 적용할 수 있는 예시를 준비했는데요. instanceof가 어떻게 계산되는지는 프로토타입 이해했다면 바로 알 수 있어 가져와봤어요.

instanceof라는 키워드는 A instanceof B로 사용하며 A가 B에 속하거나 B가 상속받는 클래스에 속하면 true를 반환합니다.

이때 만약 B가 C라는 클래스를 상속해 만들어졌다면 A instancof C도 true가 됩니다. 즉 instanceof는 특이하게도 `자손은 조상의 인스턴스가 맞다` 라고 평가됩니다.

앞에서 들었던 예시로 보자면 `누렁이 instanceof Dog`, `누렁이 instanceof Animal`모두 true가 되는거죠.

이게 어떻게 가능한걸까요

B에는 보통 클래스(생성자 함수)가 들어옵니다. 그리고 A는 보통 인스턴스겠지요. 

A는 프로토타입 체인에 탑승해있습니다. 프로토타입 객체를 쭉 타고올라갈 수 있어요. 그리고 B의 생성자 함수 또한 프로토타입 체인에 간접적으로 접근할 수 있는 prototype이라는 프로퍼티를 갖고있습니다.

A의 프로토타입 체인에서 마주하는 프로토타입 객체가 B라는 생성자 함수.prototype 프로퍼티로 접근한 프로토타입 객체와 일치하다면 A는 B의 instance로 판단할 수 있겠죠. 프로토타입 체인 안에 있으니까요. 상속을 받았다는 뜻이죠.

실제 코드로는 아래와 같겠습니다.

```jsx
// 누렁이 instanceof Animal -> ?

누렁이.__proto__ === Animal.prototype // 1번째 확인 -> false
누렁이.__proto__.__proto__ = Animal.prototype // 2번째 확인 -> true!! 

// 누렁이 instanceof Object -> ?

누렁이.__proto__ === Object.prototype // 1번째 확인 -> false
누렁이.__proto__.__proto__ = Object.prototype // 2번째 확인 -> false 
누렁이.__proto__.__proto__.__proto__ = Object.prototype // 3번째 확인 -> true!! 

const obj = {}

// obj instanceof Animal -> ?

obj.__proto__ === Animal.prototype // obj.__proto__는 Object 프로토타입 객체
obj.__proto__.__proto__ === Animal.prototype // obj.__proto__ => Object 프로토타입 객체이고 Object.__proto__ => Object 프로토타입 객체의 __proto__는 프로토타입 체인의 종료인 null 
// obj.__proto__.__proto__ 은 null이며 체인의 끝이라 더 이상 진행할 수 없으므로 false가 출력된다.
```