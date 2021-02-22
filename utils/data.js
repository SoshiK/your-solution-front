import axios from "axios";

export const getAlldoctors = async () => {
  const data = (
    await axios.get("https://your-solution-back.herokuapp.com/api/doctors")
  ).data;
  return data;
};

export const invokeZoom = async (body) => {
  const res = await axios.post("https://your-solution-back.herokuapp.com/zoomMeeting",body);
  if(res.status === 200) {
    return res.data.body.join_url;
  }
}

export const sendEmail = async (body) => {
  const res = await axios.post("https://your-solution-back.herokuapp.com/email",body);
  if(res.status === 200) {
    return true;
  }
}