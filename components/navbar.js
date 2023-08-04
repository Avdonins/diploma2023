import A from "./A";
import styles from "../styles/navbar.module.css";
import MyButton from "./UI/MyButton";
import MyModal from './UI/myModal';
import SignUpForm from "./UI/signUpForm";
import { useEffect, useState } from "react";
import { deleteCookie, getCookie, setCookie } from "cookies-next";
import axios from "axios";
import { useRouter } from "next/router";
import SearchInput from "./searchInput";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Navbar(props) {
  const [modal, setModal] = useState(false);
  const [authToken, setAuthToken] = useState("");
  const [username, setUsername] = useState(''); //CHANGE!!!!!!!!!!!!!!!!!!!!!!
  const router = useRouter();

  useEffect(() => {
    setAuthToken(getCookie("authToken"));
    const getUser = async () => {
      const res = await axios.post("http://localhost:3000/api/searchToken", {
        authToken: getCookie("authToken")
      })
      if (res.data != null) {
        setUsername(res.data.username)
      }
    }
    getUser();
  }, [])

  const logout = function (authToken) {
    if (authToken != undefined) {
      const res = axios.post('http://localhost:3000/api/removeToken', {
        authToken
      }).then(() => {
        toast.success('До свидания!', {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      }).catch(function (error) {
        console.log(error)
      })
    }
    deleteCookie('authToken')
    deleteCookie('basket')
    if (router.asPath == '/') {
      router.reload()
    } else {
      router.push('/')
    }
  }

  return (
    <>
      <div className={styles.navbar}>
        <div className={styles.navbar__links}>
          <A href={"/"} text={"Главная"} />
          {authToken &&
            <>
              <A href={"/categories"} text={"Категории"} />
              <SearchInput />
            </>
          }
        </div>
        <div className={styles.navbar__btns}>
          {authToken &&
            <>
              <A href={`/user/${username}`} text={"Мой аккаунт"} />
              <A href={"/favourites"} text={"Избранное"} />
            </>
          }
          <MyButton onClick={authToken ? () => logout(authToken) : () => setModal(true)}>
            {authToken ? "Выйти" : "Войти"}
          </MyButton>
          <MyModal visible={modal} setVisible={setModal}>
            <SignUpForm setModal={setModal} />
          </MyModal>
        </div>
      </div>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </>
  );
}