import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import ReCAPTCHA from "react-google-recaptcha";
import "./requesForm.css";
import toast from "react-hot-toast";
import Table from "react-bootstrap/Table";

const RequestForm = () => {
  const [captchaValue, setCaptchaValue] = useState(null);

  const [requests, setRequests] = useState([]);

  // fetching request history
  useEffect(() => {
    fetch("http://localhost:3000/requests", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        // updating the states
        setRequests(data);
      })
      .catch((error) => {
        setRequests([]);
        console.log(error);
      });
  }, []);
  // sending wallet request
  const handleSubmit = async (e) => {
    e.preventDefault();
    const walletAddress = e.target.walletAddress.value;
    if (captchaValue) {
      // Get the current time in 12-hour format
      const sendingTime = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
      const amount = 700;
      const requestInfo = { walletAddress, sendingTime, amount };

      try {
        const response = await fetch("http://localhost:3000/requests", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestInfo),
        });
        // updating ui request states
        if (response.ok) {
          const responseData = await response.json();
          console.log(responseData);
          const currentRequests = [...requests, responseData];
          setRequests(currentRequests);
          e.target.walletAddress.value = "";
          toast.success("Request sent successfully...");
        } else {
          throw new Error("Failed to submit request");
        }
      } catch (error) {
        console.error(error);

        toast.error("Failed to submit request. Please try again later.");
      }
    } else {
      toast.error("Please solve the ReCAPTCHA.");
    }
  };

  const handleCaptchaChange = (value) => {
    console.log("Captcha value:", value);
    setCaptchaValue(value);
  };

  return (
    <div className="request-container">
      <div>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>
              <span className="input-title">Wallet address</span>
            </Form.Label>
            <Form.Control
              type="text"
              required
              name="walletAddress"
              placeholder="Your wallet address..."
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
              <span className="input-title">Request Type</span>
            </Form.Label>
            <div className="disabled-input-container">
              <Form.Control placeholder="20 Test Link" disabled />
              <Form.Control placeholder="0.5 ETH" disabled />
            </div>
          </Form.Group>

          <div className="recaptcha-container">
            <ReCAPTCHA
              sitekey="6Lf2pXspAAAAAEzNbSyY6M-HGpvMYUY09eJQcNID"
              onChange={handleCaptchaChange}
            />
          </div>

          <Button variant="primary" type="submit" disabled={!captchaValue}>
            Send Request
          </Button>
        </Form>
      </div>
      {requests?.length > 0 && (
        <div className="request-table-container">
          <h5>
            <strong>Request History</strong>
          </h5>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Sr.</th>
                <th>Time</th>
                <th>Amount</th>
                <th>Hash</th>
              </tr>
            </thead>
            <tbody>
              {requests?.map((request, idx) => (
                <tr key={idx}>
                  <td>{idx + 1}</td>
                  <td>{request?.sendingTime}</td>
                  <td>{request?.amount}</td>
                  <td>{request?.walletAddress}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default RequestForm;
