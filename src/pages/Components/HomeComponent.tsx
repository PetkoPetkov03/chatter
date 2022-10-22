import type { User } from '../../types/UserTypes';

const Home = ({ user }: {user: User}): JSX.Element => {
  return (
    <div>Home {user?.username}</div>
  )
}

export default Home 