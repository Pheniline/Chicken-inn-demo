import { useState } from "react";
import "./App.css";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    setSubmitted(true);

    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
  }

  return (
    <main className="contact-page">
      <section className="contact-hero">
        <p className="section-eyebrow">WE'RE HERE FOR YOU</p>
        <h1>Let's Talk!</h1>
        <p>
          Have a question, feedback or need assistance? We'd love to hear from
          you.
        </p>
      </section>

      <section className="contact-container">
        <div className="contact-information">
          <h2>Get in Touch</h2>
          <p>
            Reach out to us with your questions or feedback. Our team would be
            happy to assist.
          </p>

          <div className="contact-detail">
            <h3>Phone</h3>
            <p>Contact details to be added</p>
          </div>

          <div className="contact-detail">
            <h3>Email</h3>
            <p>Contact email to be added</p>
          </div>

          <div className="contact-detail">
            <h3>Location</h3>
            <p>Kenya</p>
          </div>
        </div>

        <div className="contact-form-section">
          <h2>Send Us a Message</h2>

          {submitted && (
            <p className="success-message">
              Thank you! Your message has been received in this demo.
            </p>
          )}

          <form onSubmit={handleSubmit}>
            <label>Your Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              required
            />

            <label>Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />

            <label>Subject</label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="What is your enquiry about?"
              required
            />

            <label>Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Write your message here..."
              rows="5"
              required
            />

            <button type="submit" className="contact-submit">
              Send Message
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}

export default Contact;
