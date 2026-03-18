
import styled, { ThemeProvider } from 'styled-components/native';
import { theme } from './src/theme';
import { Dimensions, StatusBar } from 'react-native';
import { useState } from 'react';
import Input from './src/components/Input';
import Task from './src/components/Task';
import AsyncStorage from '@react-native-async-storage/async-storage'; // ✅
import AppLoading from 'expo-app-loading'; // ✅ 별도 패키지

const Container = styled.SafeAreaView`
flex: 1;
background-color: ${({ theme }) => theme.background};
align-items: center;
justify-content: flex-start;`;

const Title = styled.Text`
font-size: 40px;
font-weight: 600;
color: ${({ theme })=> theme.main};
align-self: flex-start;
margin: 0px 20px;`;

const List = styled.ScrollView`
  flex: 1;
  width: ${({ width }) => width - 40}px;
`;

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const [newTask, setNewTask] = useState('');
  const [tasks, setTasks] = useState({});
  const _onBlur = () => {
    setNewTask('');
  }
  
  const saveTasks = async tasks => {
    try {
      await AsyncStorage.setItem('tasks', JSON.stringify(tasks));
      setTasks(tasks);
    } catch(e) {
      console.error(e);
    }
  };

  // 데이터 불러오기
  const loadTasks = async () => {
    const loadedTasks = await AsyncStorage.getItem('tasks');
    setTasks(JSON.parse(loadedTasks || '{}')); 
  };

  // 완료 -> 미완료 돌아오기 버튼
  const toggleTask = id => {
    const currentTasks = Object.assign({}, tasks);
    currentTasks[id]['completed'] = !currentTasks[id]['completed'];
    saveTasks(currentTasks);
  };
  
  const addTask = () => {
    const ID = Date.now().toString();
    const newTaskObject={
      [ID]: { id: ID, text: newTask, completed: false },
    };
    setNewTask('');
    saveTasks({ ...tasks, ...newTaskObject}); // tasks와 newTaskObject를 저장한다.
  };
  const updateTask = item => {
    const currentTasks = Object.assign({}, tasks);
    currentTasks[item.id] = item;
    saveTasks(currentTasks);
  }

  const deleteTask = id => {
    const currentTasks = Object.assign({}, tasks);
    delete currentTasks[id];
    saveTasks(currentTasks);
  };
  const handleTextChange = text => {
    setNewTask(text); 
  };
  const width = Dimensions.get('window').width;

  
  return isReady ? (
    <ThemeProvider theme={theme}>
      <Container>
        <StatusBar barStyle="light-content" backgroundColor={theme.background}/>
          <Title>TODO List</Title>
          <Input placeholder="+ Add a Task" value={newTask} onChangeText={handleTextChange} onSubmitEditing={addTask} onBlur={_onBlur}/>
          <List width={width}>
            {Object.values(tasks).reverse().map(item => (
              <Task key={item.id} item={item} deleteTask={deleteTask} toggleTask={toggleTask} updateTask={updateTask}/>
            ))}
          </List>
      </Container>
    </ThemeProvider>
  ) : (
    <AppLoading startAsync={loadTasks} onFinish={() => setIsReady(true)} onError={console.error}/> // startAsync에서 오류가 발생하면 실행
  )
}


