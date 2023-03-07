import './App.scss';
import { useState } from 'react';
import usersFromServer from './api/users';
import todosFromServer from './api/todos';
import { Todo } from './types/Todo';
import { User } from './types/User';
import { TodoList } from './components/TodoList';

function getUser(userId: number): User | null {
  const foundUser = usersFromServer.find(user => user.id === userId);

  return foundUser || null;
}

export const startingTodos: Todo[] = todosFromServer.map(todo => ({
  ...todo,
  user: getUser(todo.userId),
}));

export const App = () => {
  const [isClicked, setIsClicked] = useState(false);
  const [titleName, setTitleName] = useState('');
  const [userName, setUserName] = useState('0');
  const [todos, setTodos] = useState(startingTodos);

  const handleChange = (inputValue: string) => {
    const reg = new RegExp('[a-zA-Zа-яА-Я\\d ]+');
    const letter = inputValue[inputValue.length - 1];

    if (letter !== undefined) {
      if (letter.search(reg) !== -1) {
        setTitleName(inputValue);
      }
    } else {
      setTitleName('');
    }
  };

  const chooseSelect = (selectedValue: string) => {
    setUserName(selectedValue);
  };

  const clearingForm = () => {
    setUserName('0');
    setTitleName('');
    setIsClicked(false);
  };

  const addTodo = () => {
    const arrayId = (
      [...todos]
        .sort((a, b) => (b.id - a.id))[0].id + 1
    );

    const newTodo = {
      id: arrayId,
      title: titleName,
      completed: false,
      userId: +userName,
      user: getUser(+userName),
    };

    setTodos([...todos, newTodo]);
  };

  return (
    <div className="App">
      <h1>Add todo form</h1>

      <form action="/api/users" method="POST">
        <div className="field">
          <label>
            {'Title: '}
            <input
              type="text"
              data-cy="titleInput"
              placeholder="Enter a title"
              value={titleName}
              onChange={(event) => {
                handleChange(event.target.value);
              }}
            />
          </label>

          {isClicked && (
            !titleName.trim().length && (
              <span className="error">Please enter a title</span>
            )
          )}
        </div>

        <div className="field">
          <label>
            {'User: '}
            <select
              data-cy="userSelect"
              value={userName}
              onChange={(select) => {
                chooseSelect(select.target.value);
              }}
            >
              <option value="0" disabled>Choose a user</option>
              {usersFromServer.map((user) => {
                const {
                  id,
                  name,
                } = user;

                return (
                  <option
                    value={id}
                    key={id}
                  >
                    {name}
                  </option>
                );
              })}
            </select>
          </label>

          {isClicked && (
            userName === '0') && (
            <span className="error">Please choose a user</span>
          )}

        </div>

        <button
          type="submit"
          data-cy="submitButton"
          onClick={(event) => {
            event.preventDefault();
            setIsClicked(true);
            if (userName !== '0' && titleName.trim().length > 0) {
              addTodo();
              clearingForm();
            }
          }}
        >
          Add
        </button>
      </form>

      <TodoList todos={todos} />
    </div>
  );
};
