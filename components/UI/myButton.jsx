import style from '../../styles/myButton.module.css';

const MyButton = ({children, ...props}) => {
    return (
        <button {...props} className={style.myBtn}>
            {children}
        </button>
    );
};

export default MyButton;