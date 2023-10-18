import Layout from './Layout'
import Home from './Home';
import NewPost from './NewPost';
import PostPage from './PostPage';
import About from './About';
import Missing from './Missing';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import api from './api/posts';
import EditPost from './EditPost';
import useAxiosFetch from '../src/hooks/useAxiosFetch';

function App() {
  const [ search, setSearch ] = useState('');
  const [ searchResults, setSearchResults ] = useState([]);
  const [postTitle, setPostTitle] = useState('');
  const [postBody, setPostBody] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [editBody, setEditBody] = useState('');
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();
  const {data, fetchError, isLoading} = useAxiosFetch('http://localhost:3500/posts');
  
  useEffect(() => {
    setPosts(data);
  }, [data]);

  // useEffect(() => {
  //   const fetchPosts = async () => {
  //     try {
  //       const resp = await api.get('/posts');
  //       setPosts(resp.data);
  //     } catch (error) {
  //       if (error.resp) {
  //         // this bit is from the axios dicumentation
  //         console.error(error.resp.data);
  //         console.error(error.resp.status);
  //         console.error(error.resp.headers);
  //       } else {
  //         console.error(`Error ${error.message}`)
  //       }
  //     }
  //   }

  //   fetchPosts()
  // }, [])


  useEffect(() => { 
    const filteredResults = posts.filter(post => (
      (post.body).toLowerCase().includes(search.toLowerCase())
      || (post.title).toLowerCase().includes(search.toLowerCase())
    ));

    setSearchResults(filteredResults.reverse());
  }, [posts, search])

  const handleSubmit = async (e) => {
    e.preventDefault();
    const id = posts.length ? posts[posts.length - 1].id + 1 : 1;
    const datetime = format(new Date(), 'MMMM dd, yyyy pp');
    const newPost = { id, title: postTitle, datetime, body: postBody };
    try {
      const resp = await api.post('/posts', newPost)
      const allPosts = [...posts, resp.data];
      setPosts(allPosts);
      setPostTitle('');
      setPostBody('');
      navigate('/');
    } catch (error) {
      console.error(`${error.message}`);
    }
  };

  const handleEdit = async (id) => {
    const datetime = format(new Date(), 'MMMM dd, yyyy pp');
    const updatedPost = { id, title: editTitle, datetime, body: editBody };
    try {
      const resp = await api.put(`/posts/${id}`, updatedPost)
      setPosts(posts.map(post => post.id === id ? {...resp.data} : post));
      setEditTitle('');
      setEditBody('');
      navigate('/');
    } catch (error) {
      console.error(`${error.message}`);
    }
  }
  
  const handleDelete = async (id) => {
    try {
      await api.delete(`/posts/${id}`)
      const postList = posts.filter(post => post.id !== id);
      setPosts(postList);
      navigate('/');
    } catch (error) {
      console.error(`${error.message}`);
    }
  }


  return (
    <Routes>
      <Route path='/' element={<Layout search={search} setSearch={setSearch}/>}>
        <Route index element={<Home posts={searchResults} />} />
        <Route path='post'>
          <Route index element={
            <NewPost
              postTitle={postTitle}
              setPostBody={setPostBody}
              setPostTitle={setPostTitle}
              postBody={postBody}
              handleSubmit={handleSubmit}
            />}
          />
          <Route path=':id' element={
            <PostPage 
            posts={posts} 
            handleDelete={handleDelete}/>
            }
          />        
        </Route>
        <Route path='edit/:id'>
          <Route index element={
            <EditPost
              posts={posts}
              editTitle={editTitle}
              setEditBody={setEditBody}
              setEditTitle={setEditTitle}
              editBody={editBody}
              handleEdit={handleEdit}
            />}
          />      
        </Route>
        <Route path='*' element={<Missing />}/>
        <Route path='about' element={<About />}/>
      </Route>
    </Routes>
  );
}

export default App;
