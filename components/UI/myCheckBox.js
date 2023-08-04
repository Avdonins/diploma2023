import styles from "../.././styles/myCheckBox.module.css";

const MyCheckBox = ({ id, text, onChange }) => {
  return (
    <div className={styles.checkbox__container}>
      <input
        className={styles.myCheckBox}
        type="checkbox"
        id={id}
        value="true"
        onChange={onChange}
      />
      <label className={styles.lable__chbx} htmlFor={id}>
        {text}
      </label>
    </div>
  );
};

export default MyCheckBox;
