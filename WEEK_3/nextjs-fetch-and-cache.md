# Next.js의 fetch와 데이터 렌더링 방식(SSR, SSG, ISR)과 TanStack-Query 캐시 관리의 차이점

## 1. Next.js의 fetch에 대해서

Next.js는 Node.js를 기반으로 서버 사이드 렌더링을 지원해주는 프레임워크입니다. 오늘은 이런 Next.js의 fetch에 대해서 설명해보겠습니다. 이를 설명하기 전에 Next.js와 React의 동작 방식을 비교하며 Next.js를 먼저 이해해봅시다.

**Next.js 15버전의 app router 방식을 기준으로 작성하였으며 서버 컴포넌트에서 fetch를 호출하는 상황이라는 것을 기억해주세요**

### 1.1 React와 Next의 동작방식 (CSR, SSR)

먼저 React의 CSR 동작 방식은 다음과 같습니다.

사용자가 브라우저로 주소를 입력하면 정적 파일 저장소(ex: S3)에 index.html을 요청하게 됩니다. 그 후 index.html을 받은 브라우저는 이를 파싱하며 script tag를 만나서 React 실행에 필요한 script를 다운로드 받으면 React가 실행됩니다. React가 실행되어 필요한 화면을 먼저 렌더링 후 fetch 함수를 만나면 백엔드 서버로 화면에 필요한 데이터를 요청하게 되고 백엔드 서버는 이를 json 형태로 반환하여 브라우저는 이 값을 채워 사용자에게 화면을 보여주게 됩니다.

![image](https://github.com/user-attachments/assets/8ad77b23-b42d-4de6-a9e8-23d8fed54958)


이제 Next의 SSR 동작방식에 대해 설명하겠습니다.

Next는 브라우저 요청 전에 React를 사전 빌드하여 서비스에 필요한 페이지들을 미리 준비해둡니다. 그리고 사용자가 브라우저로 주소를 입력하면, Node 서버에 페이지 요청을 하게 됩니다. 그 때 Node 서버는 fetch를 실행하여 백엔드 서버에게 필요한 데이터를 요청하게 됩니다. 응답을 받은 Node 서버는 데이터를 페이지에 채워넣어 html을 완성하고 이를 브라우저에게 응답합니다.

![image](https://github.com/user-attachments/assets/a527b44d-029f-478f-b745-67da57ce190a)


두 개의 동작방식을 비교하며 비교할 수 있는 것은 같은 fetch 함수이지만 **React CSR 환경에서는 브라우저**가 실행하고 **Next SSR 환경에서는 서버**가 실행한다는 것입니다.

### 1.2 서버에서 실행하는 fetch와 렌더링 전략

우리가 아는 fetch의 인자는 input과 requestInit이 있습니다. input에는 요청을 보낼 주소를 입력하고 나머지 설정을 requestInit에 설정하는 방식입니다.

```ts
function fetch(input: string | URL | globalThis.Request, init?: RequestInit);
```

Next에서는 기존 fetch를 확장하여 여러가지 option을 제공합니다. 이 중에서 Next option에 대해서 알아보겠습니다.
Next option으로는 revalidate과 tags가 제공됩니다.

fetch를 서버에서 호출할 때 요청을 서버 측에서 캐시하게 됩니다. 서버 측에서 데이터를 캐시해둬서 브라우저에게 html을 전달할 때 데이터를 활용하게 되는데 이 option 설정에 따라서 이 글의 첫 번째 주제인 SSR, SSG, ISR 렌더링 방식을 조절할 수 있습니다.

```ts
interface NextFetchRequestConfig {
  revalidate?: number | false;
  tags?: string[];
}
```

Next 공식문서에 따르면 revalidate의 값을 false | 0 | number를 설정할 수 있습니다.

```ts
fetch(`https://...`, { next: { revalidate: false | 0 | number } });
```

#### 1. revalidate: false와 SSG

무한히 캐시 데이터를 유지한다는 의미입니다. 무한히 캐시를 유지한다는 것은 항상 캐시 데이터를 사용한다는 것으로 변경이 잦지 않은 데이터를 보여줄 때 사용하면 좋습니다.

이는 SSG(Static Site Generation) 렌더링 방식과 연관이 있습니다.
SSG 방식은 사전 빌드 단계에서 백엔드 서버에 데이터를 요청하고 완성된 html을 만들어두게 됩니다. 그 후 브라우저가 페이지 요청을 하면 미리 만들어 둔 정적인 html을 응답하게 됩니다.

![image](https://github.com/user-attachments/assets/23229baf-313b-44cc-8ade-f0057c2fee54)


#### 2. revalidate: 0과 SSR

이 경우 캐시 데이터를 사용하지 않는다는 의미입니다. 캐시를 사용하지 않고 매 번 요청마다 새로 백엔드 서버로 요청을 보내게 됩니다. 변경이 잦고 사용자가 항상 최신 데이터를 바라봐야 할 때 사용하면 좋습니다.

이는 SSR(Server Side Rendering) 렌더링 방식과 연관있으며 브러우저로부터 요청이 있을 때마다 백엔드 서버로 요청하여 값을 채운 후 html을 응답하게 됩니다. 그림은 초반에 설명한 Next.js의 SSR 렌더링 방식과 동일하여 생략합니다.

#### 3. revalidate: number와 ISR

이 경우 캐시 데이터의 유효시간을 설정한다는 의미입니다. 캐시 데이터의 유효시간 내에 같은 요청이 오면 캐시 데이터를 사용하고 유효시간이 지나면 백엔드 서버로 새로운 데이터를 요청하게 됩니다. 여기서 유의할 점은 유효시간이 지난 후 브라우저의 요청이 올 때 백엔드 서버로 새로운 데이터를 요청하는 것이 아니라, 백그라운드로 Node 서버가 알아서 요청한다는 것입니다. 그래서 유효시간이 지났다고 해서 항상 최신화 된 데이터를 불러온다고 보장할 수는 없습니다.

이는 ISR(Incremental Static Regeneration) 렌더링 방식과 연관이 있습니다. SSG와 유사하게 사전 빌드 때 백엔드 서버로 데이터를 요청하여 미리 완성된 html을 생성하지만 이 html의 유효시간은 revalidate에 설정한 시간입니다. 이 시간 내에는 미리 만들어둔 html을 반환하지만 유효시간이 지난 경우 백그라운드에서 백엔드 서버로 새로운 데이터를 요청한 후 다시 html을 만듭니다. 만든 시점 후의 브라우저 요청부터 새로운 html을 응답하게 됩니다.

![image](https://github.com/user-attachments/assets/ca71a14a-9c0c-4ca3-9921-8ec47cf59855)


### 1.3 ISR 렌더링 전략에서 캐시 무효화 (tags option과 revalidateTag)

ISR 렌더링 방식은 유효시간을 토대로 새로운 html을 만들어야하는지 판단합니다. 그러나 클라이언트 컴포넌트에서 데이터 변경요청이 들어올 경우 유효시간이 지나지 않았음에도 새로운 데이터가 필요한 상황이 일어나게 됩니다.

이 때 tags option을 사용하면 이를 쉽게 대처할 수 있습니다. 먼저 fetch requestInit option으로 유일한 태그를 설정한 후, post, put, delete, patch의 요청이 일어났을 때 revalidateTag 메서드를 사용해서 특정 태그를 무효화시키면 유효시간과 관계없이 해당 캐시 데이터를 무효화합니다. 그리고 다음 fetch get 요청이 왔을 때 서버는 백엔드 서버로 데이터를 요청하여 새로운 html을 만들어 응답하게 됩니다.

여기까지 설명을 들었을 때 "엇 TanStack-Query의 queryKey, invalidateQueries와 똑같은 것 아니야?"라는 의문이 들며 Next.js의 fetch와 TanStack-Query는 동일한 기능을 제공하니깐 Next.js에서는 TanStack-Query가 필요하지 않다는 생각이 들 수 있습니다. (저도 똑같은 생각을 했구요ㅋㅋㅋ) 그래서 다음 주제로 이 둘의 근본적인 차이점에 대해서 설명해보려고 합니다.


## 2. TanStack-Query 캐시 관리의 차이점

TanStack-Query를 사용해보셨다면 staleTime, gcTime을 사용한 캐시 유효시간 설정과 invalidateQueries 메서드를 사용한 서버 상태관리를 경험해보셨을 것입니다. 위에서 설명한 Next.js의 fetch의 캐시 설정과 비슷해보이지만 캐시를 관리하는 주체와 캐시를 관리하는 목적에서 큰 차이가 있습니다.

### 2.1 TanStack-Query의 캐시 관리 주체와 목적

TanStack-Query는 브라우저에서 동작하는 라이브러리입니다. 그러므로 **캐시의 책임은 브라우저**가 가져가게 됩니다. 백엔드 서버로 fetch 요청을 할 때 동일한 요청이 브라우저 캐시에 저장되어있다면 캐시 데이터를 사용합니다. 또한 mutation이 일어나 서버 상태가 변했을 때 캐시 무효화 전략으로 새로운 데이터를 브라우저 캐시에 저장하게 됩니다. 이 과정을 보면 TanStack-Query가 캐시를 관리하는 목적은 **api 호출 최적화 및 서버 상태 관리**입니다.

### 2.2 Next.js fetch의 캐시 관리 주체와 목적

반면 Next.js의 fetch는 Node 서버에서 실행되는 함수입니다. 그러므로 **캐시의 책임은 Node 서버**가 가져가게 됩니다. 사전 빌드 단계에서 백엔드 서버로 데이터를 요청한 후 완성된 html을 만들어두면 브라우저의 동일한 페이지 요청이 있을 때 완성된 html을 전달하게 됩니다. 또한 revalidateTag 호출 후 브라우저의 요청 시 백엔드로 새로운 데이터를 요청하여 html을 만든 후 응답하게 됩니다. 이 과정을 보면 fetch가 캐시를 관리하는 목적은 **정적 HTML 파일 생성**에 있습니다.

### 2.3 브라우저 캐시와 서버 캐시의 차이점

브라우저에 캐시가 되는 TanStack-Query는 한 브라우저에 영향을 받을 수 밖에 없습니다. 이와 관련하여 저의 실패 사례를 하나 가져오겠습니다. 과거에 백엔드 서버로의 api 요청을 극단적으로 줄이기 위해 새로고침이 되어도 캐시 데이터가 사라지지 않도록 persist TanStack-Query를 사용한 적이 있었습니다. 비슷하게 invalidateQueries를 사용한 캐시 무효화 전략을 가져갔고 서비스를 출시했습니다. 출시한 뒤 며칠 뒤 사용자로부터 피드백을 받게 됐는데 **내가 수정한 내용이 옆 사람 컴퓨터에서 확인이 되지 않는다**는 것이었습니다. 캐시 무효화를 한들 해당 브라우저에서만 새로운 데이터가 보이지 다른 브라우저에서는 invalidateQueries가 호출되지 않아 새로운 데어터가 보이지 않는 문제였습니다. 즉 캐시가 브라우저에서 관리되기 때문에 일어난 문제였습니다.

하지만 이 상황을 서버 캐시로 가져가면 이야기가 달라집니다. 한 브라우저에서 서버로 변경 요청을 하여 서버에서 revalidateTag가 호출되면 서버의 캐시 데이터가 무효화되고 다음 요청이 들어왔을 때 새로운 html을 만들어 브라우저로 응답하게 되므로 **내가 수정한 내용이 옆 사람 컴퓨터에서 확인이 되지 않는 문제가 일어나지 않게 됩니다.** 캐시를 서버에서 관리하기 때문에 위 문제가 사라진 것입니다.

이 사례를 떠올리게 됐을 때 TanStack-Query와 Next.js의 fetch가 근본적으로 차이가 있다는 것을 와닿게 되었고 이를 구분해서 생각해야겠다는 것을 알게 되었습니다.

### 2.4 Next.js에서 TanStack-Query를 효과적으로 사용하는 방법

그러면 Next js에서 어떻게 TanStack-Query를 효과적으로 사용할 수 있을까? [TanStack-Query 공식 문서](https://tanstack.com/query/latest/docs/framework/react/guides/ssr#full-nextjs-pages-router-example)에서 이를 찾아볼 수 있었다.

요약하자면 서버 컴포넌트에서 prefetch로 사전에 데이터를 브라우저 캐시에 설정해두고 dehydrate를 한 뒤 hydration이 일어난 후 클라이언트 컴포넌트에서 useQuery를 실행하면 백엔드 서버로 요청을 하지 않고 서버에서 미리 요청해 둔 데이터를 사용할 수 있다는 것이다.

hydration이 일어난 후 클라이언트 컴포넌트에서 값을 사용할 때 api 요청 시간과 호출 횟수를 줄일 수 있다는 장점을 얻을 수 있다.

Next.js의 fetch와 TanStack-Query의 cache는 대체재가 아니라 보완재라는 것을 인지하여 둘을 적절하게 잘 이용하면 사용자 경험을 높이는데 도움을 줄 수 있을 것이라 생각합니다.

# 참고문헌
[Next.js fetch 공식문서](https://nextjs.org/docs/app/api-reference/functions/fetch#fetchurl-options)
[TanStack-Query 공식 문서](https://tanstack.com/query/latest/docs/framework/react/guides/ssr#full-nextjs-pages-router-example)
