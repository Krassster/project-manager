import Menu from "../../layout/menu/Menu";

const Profile = () => {
  return (
    <div className="container">
      <Menu />
      <div>Имя</div>
      <div>Количество проектов</div>
      <div>Количество задач (выполнено/всего)</div>
      <div>Дата создания аккаунта</div>
    </div>
  );
};

export default Profile;
