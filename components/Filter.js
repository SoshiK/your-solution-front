import { useState, useEffect } from "react";
import styles from "../styles/Filter.module.css";
export default function Filter(props) {
  const [selectedSpecialty, setSelectedSpecialty] = useState("All");
  const [selectedDay, setSelectedDay] = useState("All");
  useEffect(() => {
    let filterdDoctors = props.allDoctors;
    filterdDoctors = filterdDoctors.filter((doctor) => {
      if (selectedSpecialty !== "All" && selectedDay !== "All")
        return (
          doctor.specialty === selectedSpecialty &&
          doctor.availability[selectedDay].length > 0
        );
      if (selectedSpecialty !== "All")
        return doctor.specialty === selectedSpecialty;
      if (selectedDay !== "All") {
        return doctor.availability[selectedDay].length > 0;
      }
      return true;
    });
    props.setDoctors(filterdDoctors);
  }, [selectedSpecialty, selectedDay]);
  return (
    <div className={styles.filter}>
      <select
        name="specialty"
        size="1"
        className={styles.selectbox}
        onChange={(e) => {
          setSelectedSpecialty(e.target.value);
        }}
      >
        <option value="All" selected>
          All Specialties
        </option>
        <option value="General Physician">General Physician</option>
        <option value="Surgeon">Surgeon</option>
        <option value="Physical Therapist">Physical Therapist</option>
        <option value="Nurse">Nurse</option>
        <option value="Neurologist">Neurologist</option>
        <option value="Pediatrician">Pediatrician</option>
        <option value="Dentist">Dentist</option>
        <option value="Dermatologist">Dermatologist</option>
        <option value="Pharmacist">Pharmacist</option>
      </select>
      <select
        name="date"
        size="1"
        className={styles.selectbox}
        onChange={(e) => {
          setSelectedDay(e.target.value);
        }}
      >
        <option value="All" selected>
          All Days
        </option>
        <option value="Sunday">Sunday</option>
        <option value="Monday">Monday</option>
        <option value="Tuesday">Tuesday</option>
        <option value="Wednesday">Wednesday</option>
        <option value="Thursday">Thursday</option>
        <option value="Friday">Friday</option>
        <option value="Saturday">Saturday</option>
      </select>
    </div>
  );
}
