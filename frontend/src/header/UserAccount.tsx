interface UserAccountProps {
  userName: string;
}

function UserAccount({ userName } : UserAccountProps) {
  return (
    <div className='user-account'>
      <i className="bi bi-person-circle"></i>
      <div>{userName}</div>
    </div>
  );
};

export default UserAccount;