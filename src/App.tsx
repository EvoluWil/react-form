import './App.css'
import Form from './components/Form'
import { UserAndAddress } from './components/UserAndAddress'
import { user } from './constants/user'

function App() {

  return (
    <>
      <Form user={user} />
      {/* <UserAndAddress /> */}
    </>
  )
}

export default App
