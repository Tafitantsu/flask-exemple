import React from 'react';

const ContactPage = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Merci pour votre message ! (Ceci est une démonstration)');
  };

  return (
    <div className="container fade-in">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card">
            <div className="card-header text-center">
              <h1 className="display-6">Contactez-Nous</h1>
            </div>
            <div className="card-body p-4">
              <p className="text-center">Vous avez une question, une suggestion ou vous voulez simplement dire bonjour ? Remplissez le formulaire ci-dessous.</p>
              
              <form onSubmit={handleSubmit} className="mt-4">
                <div className="mb-3">
                  <label htmlFor="contact-name" className="form-label">Votre Nom</label>
                  <input type="text" className="form-control" id="contact-name" required />
                </div>
                <div className="mb-3">
                  <label htmlFor="contact-email" className="form-label">Votre Email</label>
                  <input type="email" className="form-control" id="contact-email" required />
                </div>
                <div className="mb-3">
                  <label htmlFor="contact-message" className="form-label">Votre Message</label>
                  <textarea className="form-control" id="contact-message" rows="5" required></textarea>
                </div>
                <div className="text-center">
                  <button type="submit" className="btn btn-primary">Envoyer le Message</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
