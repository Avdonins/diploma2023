import Content from "../components/content";
import Layout from "../components/layout";
import MainPage from "../components/mainPage";

const index = () => {
  return (
    <Layout title={"Главная страница"}>
      <Content>
        <MainPage />
      </Content>
    </Layout>
  );
};

export default index;
