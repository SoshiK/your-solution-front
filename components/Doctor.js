import styles from "../styles/Doctor.module.css";

export default function Doctor(props) {
  return (
    <div
      className={styles.doctor}
      onClick={() => {
        props.setIndex(props.index);
        props.setChangeView(false);
      }}
    >
      <div>
        <img className={styles.doctorimage} src={props.doctor.image} />
      </div>
      <div>
        <div className={styles.doctorname}>Dr. {props.doctor.first_name}</div>
        <div className={styles.doctorspecialty}>
          Specialty: {props.doctor.specialty}
        </div>
        <div className={styles.doctorprice}>
          {" "}
          Session Fee: {props.doctor.price} yen
        </div>
      </div>
    </div>
  );
}
