import logo from './logo.svg';
import './App.css';
import { useState } from 'react'; // '훅'이라는 함수




function Article(props) {

  return       <article>
  <h2>{[props.title]}</h2>
  {props.body}
</article>
}

function Header(props) {
  console.log('props: ', props.title);
  return <header>
  <h1><a href='/' onClick={(event) => {
    event.preventDefault();
    props.onChangeMode();
  }}>{props.title}</a></h1>
</header>
}

function Nav(props) {
  const list = [];
  
  for(let i=0; i<props.topics.length; i++) {
    let t = props.topics[i];
    list.push(<li key={t.id}>
      <a id={t.id} href={'/read/'+t.id} onClick={event => {
        event.preventDefault();
        props.onChangeMode(Number(event.target.id));
      }}>{t.title}</a>
      </li>)
  }


  return       <nav>
  <ol>
    {list}
  </ol>
</nav>
}

function Create(props) {
  return <article>
    <h2>Create</h2>
    <form onSubmit={event => {
      event.preventDefault();
      const title = event.target.title.value;
      const body = event.target.body.value;
      props.onCreate(title, body);
    }}>
      <p><input type='text' name='title' placeholder='Titlte'></input></p>
      <p><textarea name='body' placeholder='body'></textarea></p>
      <p><input type='submit' value='Create'></input></p>
    </form>
    <h2>Create</h2>
  </article>
}

function Update(props) {
  const [title, setTitle] = useState(props.title);
  const [body, setBody] = useState(props.body);
  return <article>
    <h2>Update</h2>
    <form onSubmit={event => {
      event.preventDefault();
      const title = event.target.title.value;
      const body = event.target.body.value;
      props.onUpdate(title, body);
    }}>
      <p><input type='text' name='title' placeholder='title' value={title} onChange={event => {
        setTitle(event.target.value);
      }}></input></p>
      <p><textarea name='body' placeholder='body' value={body} onChange={event => {
        setBody(event.target.value);
      }}></textarea></p>
      <p><input type='submit' value='Update'></input></p>
    </form>
    <h2>Create</h2>
  </article>
}

function App() {
  // useState는 배열을 만든다. 1: 상태의 값을 읽음 2: 값을 바꿀 수 있는 함수
  //const _mode = useState('WELCOME'); // useState의 값은 초기값
  //const mode = _mode[0];
  //const setMode = _mode[1];
  const [mode, setMode] = useState('WELCOME');
  const [id, setId] = useState(null);
  const [nextId, setNextId] = useState(4);
  const [topics, setTopics] = useState([
    {id: 1, title: 'html', body: 'html is ...'},
    {id: 2, title: 'css', body: 'css is ...'},
    {id: 3, title: 'js', body: 'js is ...'}
  ]);

  let content = null;
  let contextController = null;
  if(mode === 'WELCOME') {
    content = <Article title="Welcome" body="Hello, Web"></Article>
  } else if(mode === 'READ'){
    let title, body = null;
    for(let i = 0; i<topics.length; i++) {
      if(topics[i].id === id) {
        title = topics[i].title;
        body = topics[i].body;
      }
    }
    content = <Article title={title} body={body}></Article>
    contextController = <>
    <li><a href={'/update/'+id} onClick={event => {
      event.preventDefault();
      setMode('UPDATE');
    }}>Update</a></li>
    <li><input type='button' value='Delete' onClick={() => {
      const newTopics = [];
      for(let i = 0; i < topics.length; i++) {
        if(topics[i].id !== id) {
          newTopics.push(topics[i]);
        }
      }
      setTopics(newTopics);
      setMode('WELCOME');
    }}/></li>
    </>
  } else if(mode === 'CREATE') {
    content = <Create onCreate={(_title, _body) => {
      const newTopic = {id: nextId, title: _title, body: _body}
      const newTopics = [...topics]; // 다른 데이터로 만들어야 리액트가 재렌더링을 하기 때문에 복사를 한 뒤 값을 넣어 주는 것이다. 주소가 달라야 함
      newTopics.push(newTopic);
      setTopics(newTopics);
      setMode('READ');
      setId(nextId);
      setNextId(nextId + 1);
    }}></Create>
  } else if(mode === 'UPDATE') {
    let title, body = null;
    for(let i = 0; i<topics.length; i++) {
      if(topics[i].id === id) {
        title = topics[i].title;
        body = topics[i].body;
      }
    }
    content = <Update title={title} body={body} onUpdate={(title, body) => {
      const newTopics = [...topics];
      const updatedTopic = {id: id, title: title, body: body}
      for(let i = 0; i < newTopics.length; i++ ) {
        if(newTopics[i].id === id) {
          newTopics[i] = updatedTopic;
          break;
        }
      }
      setTopics(newTopics);
      setMode('READ');
    }}></Update>
  }


  return (
    <div>
      <Header title="React" onChangeMode={() => {
        setMode('WELCOME');
      }}></Header>
      <Nav topics={topics} onChangeMode={(_id) => {
        setMode('READ');
        setId(_id);
      }}></Nav>
      {content}
      <ul>
      <li><a href='/create' onClick={event => {
        event.preventDefault();
        setMode("CREATE");
      }}>Create</a></li>
      {contextController}
      </ul>
    </div>
  );
}

export default App;
