import React from "react";
import {
  injectStripe,
  CardNumberElement,
  CardExpiryElement,
  CardCVCElement,
} from "react-stripe-elements";
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  FormFeedback,
} from "reactstrap";
import { Formik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Router from "next/router";
import styles from "../styles/CheckoutForm.module.css";
import { useRouter } from "next/router";
import { invokeZoom, sendEmail } from "../utils/data";
import moment from "moment";

const CheckoutForm = (props) => {
  const router = useRouter();
  return <CheckoutFormClass {...props} router={router} />;
};

class CheckoutFormClass extends React.Component {
  handlePayment = async (values) => {
    const headers = new Headers();
    headers.set("Content-type", "application/json");

    //paymentIntentの作成を（ローカルサーバ経由で）リクエスト
    const responseJson = (
      await axios.post(
        "https://your-solution-back.herokuapp.com/createPaymentIntent",
        {
          amount: values.amount,
          username: values.username,
        },
        {
          headers: headers,
        }
      )
    ).data;

    //レスポンスからclient_secretを取得
    const client_secret = responseJson.client_secret;

    //client_secretを利用して（確認情報をStripeに投げて）決済を完了させる
    const confirmRes = await this.props.stripe.confirmCardPayment(
      client_secret,
      {
        payment_method: {
          // card: this.props.elements.getElement('card'),
          card: this.props.elements.getElement("cardNumber"),
          billing_details: {
            name: values.username,
          },
        },
      }
    );
    if (
      confirmRes.paymentIntent &&
      confirmRes.paymentIntent.status === "succeeded"
    ) {
      alert("Completed Payment!");
      const dateFormat = moment()
        .add(7, "days")
        .day(this.props.router.query.date)
        .format("YYYY-MM-DD");
      const zoomBody = {
        time: `${dateFormat}T${this.props.router.query.time}:00`,
        userName: values.username,
        doctorName: this.props.router.query.doctorName,
      };
      const url = await invokeZoom(zoomBody);
      const body = {
        userName: values.username,
        doctorName: this.props.router.query.doctorName,
        time: this.props.router.query.time,
        date: dateFormat,
        url: url,
        email: values.email,
        doctorPic: this.props.router.query.doctorPic,
      };
      const res = await sendEmail(body);
      if (!res) {
        alert("Can not send an email");
      }
      Router.push({
        pathname: "/checkout/success",
        query: {
          name: values.username,
          url: url,
          doctorPic: this.props.router.query.doctorPic,
          doctorName: this.props.router.query.doctorName,
          time: this.props.router.query.time,
          date: dateFormat,
        },
      });
      return;
    } else {
      Router.push({
        pathname: "/checkout/fail",
        query: {
          name: values.username,
        },
      });
      return;
    }
  };

  render() {
    return (
      <div className={styles.container}>
          <div className={styles.picholder}>
            <img className={styles.docpic} src={this.props.router.query.doctorPic}></img>
        <div className={styles.name}>
          Meet with Dr. {this.props.router.query.doctorName} at{" "}
          {/* {this.dateView()} */}
          {this.props.router.query.time}
        </div>
          </div>
        <div className={styles.details}>
            <div className={styles.payment}>
          <p>Payment Information</p>

            </div>
          <Formik
            initialValues={{
              amount: this.props.router.query.amount,
              username: "TARO YAMADA",
              email: "",
            }}
            onSubmit={(values) => this.handlePayment(values)}
            validationSchema={Yup.object().shape({
              amount: Yup.number().min(1).max(100000),
            })}
          >
            {({
              handleChange,
              handleSubmit,
              handleBlur,
              values,
              errors,
              touched,
            }) => (
              <Form onSubmit={handleSubmit}>
                <FormGroup>
                  <Label>Amount (in yen)</Label>
                  <Input
                    disabled
                    type="text"
                    name="amount"
                    value={values.amount}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    invalid={Boolean(touched.amount && errors.amount)}
                  />
                  <FormFeedback>{errors.amount}</FormFeedback>
                </FormGroup>
                <FormGroup>
                  <Label>Your Name</Label>
                  <Input
                    type="text"
                    name="username"
                    value={values.username}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    invalid={Boolean(touched.username && errors.username)}
                  />
                  <FormFeedback>{errors.username}</FormFeedback>
                </FormGroup>
                <FormGroup>
                  <Label>E-mail</Label>
                  <Input
                    type="email"
                    name="email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    invalid={Boolean(touched.email && errors.email)}
                  />
                  <FormGroup>{errors.email}</FormGroup>
                </FormGroup>
                {/* <CardElement
                                    className="bg-light p-3"
                                    hidePostalCode={true}
                                /> */}
                <legend className="col-form-label">Card Number</legend>
                <CardNumberElement
                  ref={this.cardNumberRef}
                  className="p-2 bg-light"
                />
                <legend className="col-form-label">Expiration Date</legend>
                <CardExpiryElement className="p-2 bg-light" />
                <legend className="col-form-label">Security Code</legend>
                <CardCVCElement className="p-2 bg-light" />

                <Button
                  type="submit"
                  onClick={this.submit}
                  className="my-3"
                  color="primary"
                >
                  Book Appointment
                </Button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    );
  }
}

export default injectStripe(CheckoutForm);
