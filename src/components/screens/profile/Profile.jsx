import Layout from "../../layout/Layout";

const Profile = () => {
  return (
    <Layout>
      <div className="container">
        <div>Имя</div>
        <div>Количество проектов</div>
        <div>Количество задач (выполнено/всего)</div>
        <div>Дата создания аккаунта</div>
      </div>
    </Layout>
  );
};

export default Profile;
