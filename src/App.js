import { useState } from 'react';

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>{children}</button>
  )
}

export default function App() {

  const [addFriend, setAddFriend] = useState(false);
  const [totalFriends, setTotalFriends] = useState(initialFriends);
  const [currFriend, setCurrFriend] = useState(null);

  function AddNewFriend(friend) {
    setTotalFriends((totalFriends) => [...totalFriends, friend]);
    setAddFriend((addFriend) => !addFriend);
  }

  function handleAddFriend() {
    setAddFriend((addFriend) => !addFriend);
  }

  function handleCurrentFriend(friend) {
    setCurrFriend(currFriend => currFriend?.id === friend.id ? null : friend);
    setAddFriend((addFriend) => false);
  }

  function handelSubmitSpilt(value) {
    setTotalFriends((totalFriends) =>
      totalFriends.map(friend =>
        friend.id === currFriend.id ?
          { ...friend, balance: friend.balance + value }
          : friend))

    setCurrFriend(null);
  }

  return (<div className="app">
    <div className="sidebar">
      <FriendsList
        friends={totalFriends}
        onhandelCurrent={handleCurrentFriend}
        currFriend={currFriend}
      />
      {
        addFriend && <FormAddFriend onAddFriend={AddNewFriend} />
      }
      <Button className="button"
        onClick={handleAddFriend}>{addFriend ? 'Close' : 'Add Friend'}
      </Button>
    </div>

    <SplitBill
      currFriend={currFriend}
      onhandelSubmit={handelSubmitSpilt}
    />

  </div>)
}


function FriendsList({ friends, onhandelCurrent, currFriend }) {


  return (
    <ul>
      {
        friends.map((friend) =>
          <Friend
            friend={friend}
            key={friend.name}
            onhandelCurrent={onhandelCurrent}
            currFriend={currFriend} />)
      }
    </ul>
  )
}



function Friend({ friend, onhandelCurrent, currFriend }) {

  const nowFriend = friend.id === currFriend?.id;

  return (
    <li className={nowFriend ? 'selected' : ''}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      {
        friend.balance < 0 && <p className="red">You own {friend.name} {friend.balance}$</p>
      }
      {
        friend.balance > 0 && <p className="green">{friend.name} owes you {friend.balance}$</p>
      }
      {
        friend.balance === 0 && <p>You and {friend.name} are even</p>
      }
      <Button onClick={() => onhandelCurrent(friend)}>{nowFriend ? 'close' : 'select'}</Button>
    </li>
  )
}

function FormAddFriend({ onAddFriend }) {
  const [name, setName] = useState('');
  const [image, setImage] = useState('https://i.pravatar.cc/48');

  function handleSubmitForm(evt) {
    evt.preventDefault();

    let id = crypto.randomUUID();

    const newFriend = {
      name,
      image: `${image}?=${id}`,
      id,
      balance: 0,
    }

    onAddFriend(newFriend);

    setImage('');
    setName('https://i.pravatar.cc/48');
  }

  return (
    <form className="form-add-friend" onSubmit={handleSubmitForm}>
      <lable >🧑‍🤝‍🧑 name</lable>
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} />

      <label>🌇 Image URL</label>
      <input type="text" value={image} onChange={(e) => setImage(e.target.value)} />

      <Button className="button">Add</Button>
    </form>
  )
}

function SplitBill({ currFriend, onhandelSubmit }) {
  const [billValuse, setBillValue] = useState('');
  const [payByUser, setPayByUser] = useState('');
  const [whoIsPaying, setWhoIsPaying] = useState('user');
  const friendExpense = billValuse ? billValuse - payByUser : "";

  function handelSubmit(evt) {
    evt.preventDefault();

    if (!billValuse || !payByUser) return;

    onhandelSubmit(whoIsPaying === 'user' ? friendExpense : -payByUser);
    setBillValue('');
    setPayByUser('');
    setWhoIsPaying('user')
  }

  return (
    currFriend &&
    <form className="form-split-bill" onSubmit={handelSubmit}>

      <h2>Split A Bill With {currFriend.name}</h2>

      <lable>🤑 Bill value</lable>
      <input type="text" value={billValuse} onChange={(e) => setBillValue(Number(e.target.value))} />

      <label>🫠 Your Expense</label>
      <input type='text' value={payByUser} onChange={(e) => setPayByUser(Number(e.target.value) > billValuse ? payByUser : Number(e.target.value))} />


      <label>🧑‍🤝‍🧑 {currFriend.name} Expense</label>
      <input type='text' disabled value={friendExpense} />

      <label>🌇 Who's paying the bill</label>
      <select
        value={whoIsPaying}
        onChange={(e) => setWhoIsPaying(e.target.value)}>
        <option value="user">user</option>
        <option value={currFriend.name}>{currFriend.name}</option>
      </select>

      <Button className="button">Add</Button>
    </form>
  )
}