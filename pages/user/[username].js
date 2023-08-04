import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import AdminPanel from "../../components/adminPanel";
import Content from "../../components/content";
import Layout from '../../components/layout'
import MyButton from "../../components/UI/MyButton";
import MyInput from "../../components/UI/myInput";
import MyModal from "../../components/UI/myModal";
import styles from "../../styles/username.module.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export async function getServerSideProps(context) {
    const authToken = context.req.cookies['authToken']
    if (authToken == undefined || authToken == "") {
        return {
            redirect: {
                destination: '/',
                permanent: false
            }
        }
    }
    else {
        const res = await axios.post('http://localhost:3000/api/searchToken', {
            authToken
        }).catch(function (error) {
            console.log(error)
        })
        if (res.data != null) {
            return {
                props: {
                    user: res.data
                }
            }
        }
    }
}

const User = ({ user }) => {
    const [modal, setModal] = useState(false);
    const router = useRouter();
    const { username } = router.query
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm(); //{ mode: "onChange" }

    const changePass = async ({ password, new_password }) => {
        const response = await axios.post('http://localhost:3000/api/users/changePassword', {
            username,
            password,
            new_password
        }).then(function (response) {
            if (response.status == 200) {
                toast.success('Пароль успешно изменен!', {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
                // alert("Пароль успешно изменен")
                setModal(false);
                reset();
            }
        }).catch(function (error) {
            toast.error(`Ошибка: ${error.response.data.message}`, {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
            // alert("Неверный пароль")
        })
    }

    if (user.username == username) {
        return (
            <>
                <Layout>
                    <Content>
                        <div className={styles.user_page__container}>
                            <div className={styles.user_page__header}>
                                <h2>Моя страница</h2>
                            </div>
                            <div className={styles.user_page__body}>
                                <div className={styles.user_page__body_item}>
                                    Username: {user.username}
                                </div>
                                <div className={styles.user_page__body_item}>
                                    Email: {user.email}
                                </div>
                                <div className={styles.user_page__body_item}>
                                    <MyButton onClick={() => setModal(true)}>
                                        Сменить пароль
                                    </MyButton>
                                    <MyModal visible={modal} setVisible={setModal}>
                                        <form onSubmit={handleSubmit(changePass)}>
                                            <h2>Смена пароля</h2>
                                            <MyInput
                                                {...register("password", {
                                                    required: "Обязательное поле",
                                                    minLength: {
                                                        value: 6,
                                                        message: "Пароль должен состоять минимум из 6 символов",
                                                    },
                                                })}
                                                type={"password"}
                                                placeholder="Старый пароль"
                                            />
                                            {errors?.password && (
                                                <span className="error">{errors.password.message}</span>
                                            )}
                                            <MyInput
                                                {...register("new_password", {
                                                    required: "Обязательное поле",
                                                    minLength: {
                                                        value: 6,
                                                        message: "Пароль должен состоять минимум из 6 символов",
                                                    },
                                                })}
                                                type={"password"}
                                                placeholder="Новый пароль"
                                            />
                                            {errors?.new_password && (
                                                <div>
                                                    <span className="error">{errors.new_password.message}</span>
                                                </div>
                                            )}
                                            <MyButton>
                                                Подтвердить
                                            </MyButton>
                                        </form>
                                    </MyModal>
                                </div>
                            </div>
                        </div>
                        <br />
                        {user.role == 'ADMIN' &&
                            <AdminPanel />
                        }
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
                    </Content>
                </Layout>
            </>
        )
    }
    else {
        return (
            <>
                <Layout>
                    <Content>
                        <div className={styles.user_page__container}>
                            <div className={styles.user_page__header}>
                                <h3>У вас нет доступа к этой странице</h3>
                            </div>
                            <MyButton onClick={() => router.push('/user/' + user.username)}>
                                Вернуться на мою страницу
                            </MyButton>
                        </div>
                    </Content>
                </Layout>
            </>
        );
    }
};

export default User;