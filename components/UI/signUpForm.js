import MyButton from "./MyButton";
import MyInput from "./myInput";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useState } from "react";
import styles from "../../styles/signUpForm.module.css";
import { setCookie, getCookie } from "cookies-next";
import MyCheckBox from "./myCheckBox";
import { useRouter } from "next/router";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export async function getServerSideProps(context) {
  const authToken = context.req.cookies["authToken"];
  if (authToken != null) {
    const res = await axios.post("http://localhost:3000/api/searchToken", {
      authToken,
    }).catch(function (error) { });

    if (res.data != null) {
      return {
        redirect: {
          destination: "/user/" + res.data.username,
          permanent: false,
        },
      };
    }
  }
  return {
    props: {},
  };
}

const SignUpForm = ({ setModal }) => {

  const [registered, setRegistered] = useState(false);
  const [checked, setChecked] = useState(false);
  const router = useRouter();

  const handleChecked = () => {
    checked ? setChecked(false) : setChecked(true);
  }

  const {
    register: signUp,
    handleSubmit: handleSignUp,
    formState: { errors: errorsSignUp },
    reset: resetSignUp,
  } = useForm(); //{ mode: "onChange" }

  const {
    register: signIn,
    handleSubmit: handleSignIn,
    formState: { errors: errorsSignIn },
    reset: resetSignIn,
  } = useForm(); //{ mode: "onChange" }

  const onSignUp = async (data) => {
    resetSignUp();
    const { username, password, email } = data;
    await axios
      .post("http://localhost:3000/api/signup", {
        username,
        password,
        email,
      })
      .then(function (response) {
        resetSignUp();
        setModal(false);
        toast.success("Успешная регистрация! Теперь можно войти", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        // alert("Успешная регистрация");
      })
      .catch(function (error) {
        toast.warn("Пользователь с таким логином и/или почтой уже существует", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        // alert("Пользователь с таким логином и/или почтой уже существует");
      });
    console.log(data);
  };

  const onSignIn = async (data) => {
    const remMe = checked;
    resetSignIn();
    setChecked(false);
    setModal(false);
    const { username, password } = data;
    await axios.post("http://localhost:3000/api/signin", {
      username,
      password,
      remMe,
    }).then(async (response) => {
      if (remMe) {
        setCookie("authToken", response.data, {
          maxAge: 60 * 60 * 24 * 30, // 30 days
          path: "/",
        });
      } else {
        setCookie("authToken", response.data, {
          expires: 0,
          path: "/",
        });
      }
      await axios.post("http://localhost:3000/api/basket/getBasket", {
        authToken: response.data
      }).then((response) => {
        let devices_str = ''
        response.data.devices.forEach(device => {
          devices_str += device.goodId + ' '
        })
        setCookie("basket", devices_str.trimEnd(), {
          expires: 0,
          path: "/",
        })
        toast.success('Успешно! Входим...', {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        // setTimeout(() => {
        // }, 2000)
        router.push("/user/" + username)
        // console.log(getCookie('basket'))
      }).catch(err => {
        toast.error(`Ошибка! ${err}`, {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        console.log(err);
      })
      // router.push("/user/" + username)
    }).catch(function (error) {
      toast.warn('Неверный логин и/или пароль!', {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      // alert("Неверный логин или пароль");
      console.log(error);
    })
  };

  const changeToSignIn = () => {
    registered ? setRegistered(false) : setRegistered(true);
    registered ? resetSignIn() : resetSignUp();
  };

  return (
    <>
      <div className={styles.form__header}>
        <h3>{registered ? "Регистрация" : "Войти"}</h3>
        <button className={styles.form__btn} onClick={() => changeToSignIn()}>
          {registered
            ? "Уже есть аккаунт? Войти"
            : "Еще нет аккаунта? Зарегистрироваться"}
        </button>
      </div>

      <form
        className={registered ? styles.active : styles.disable}
        onSubmit={handleSignUp(onSignUp)}
      >
        <MyInput
          {...signUp("username", {
            required: "Обязательное поле",
            minLength: {
              value: 3,
              message: "Длина поля должна быть не менее 3 символов",
            },
            maxLength: {
              value: 20,
              message: "Длина поля должна быть не более 20 символов",
            },
          })}
          type="text"
          placeholder="username"
        />
        {errorsSignUp?.username && (
          <div>
            <span className="error">{errorsSignUp.username.message}</span>
          </div>
        )}

        <MyInput
          {...signUp("email", {
            required: "Обязательное поле",
            pattern: {
              value:
                /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/,
              message: "Введите корректный email",
            },
          })}
          type={"email"}
          placeholder="email"
        />
        {errorsSignUp?.email && (
          <div>
            <span className="error">{errorsSignUp.email.message}</span>
          </div>
        )}

        <MyInput
          {...signUp("password", {
            required: "Обязательное поле",
            minLength: {
              value: 6,
              message: "Пароль должен состоять минимум из 6 символов",
            },
          })}
          type={"password"}
          placeholder="password"
        />
        {errorsSignUp?.password && (
          <div>
            <span className="error">{errorsSignUp.password.message}</span>
          </div>
        )}

        <div className={styles.form__container_btn}>
          <MyButton>Зарегистрироваться</MyButton>
          <MyButton onClick={() => resetSignUp()}>Очистить форму</MyButton>
        </div>
      </form>

      <form
        className={registered ? styles.disable : styles.active}
        onSubmit={handleSignIn(onSignIn)}
      >
        <MyInput
          {...signIn("username", {
            required: "Обязательное поле",
            minLength: {
              value: 3,
              message: "Длина поля должна быть не менее 3 символов",
            },
            maxLength: {
              value: 20,
              message: "Длина поля должна быть не более 20 символов",
            },
          })}
          type="text"
          placeholder="username"
        />
        {errorsSignIn?.username && (
          <div>
            <span className="error">{errorsSignIn.username.message}</span>
          </div>
        )}

        <MyInput
          {...signIn("password", {
            required: "Обязательное поле",
            minLength: {
              value: 6,
              message: "Пароль должен состоять минимум из 6 символов",
            },
          })}
          type={"password"}
          placeholder="password"
        />
        {errorsSignIn?.password && (
          <div>
            <span className="error">{errorsSignIn.password.message}</span>
          </div>
        )}
        <div className={styles.form__container_btn}>
          <MyButton>Войти</MyButton>
          <MyButton onClick={() => { resetSignIn(); setChecked(false) }}>Очистить форму</MyButton>
          <MyCheckBox name="rememberMe" text="Запомнить" onChange={handleChecked} />
        </div>
      </form>

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
};

export default SignUpForm;
