<?php
if (!defined('ABSPATH')) {
  exit;
}
get_header();
$sent = isset($_GET['sent']);
$error = isset($_GET['error']);
?>

<section class="page-hero reveal">
  <div class="page-hero__inner">
    <h1>Contact Us</h1>
    <p>We are here to help. Reach out and we will respond promptly.</p>
  </div>
</section>

<section class="contact-page reveal delay-1">
  <div class="contact-page__inner">
    <div class="contact-page__details">
      <h2>Contact</h2>
      <p>327 NE 6th St #1,<br>Grants Pass, OR 97526</p>
      <p>Call or Text! 541-474-2260</p>
      <p><a href="mailto:a1qualitydocuments@gmail.com">a1qualitydocuments@gmail.com</a></p>
      <div class="contact-page__map">
        <iframe
          title="A1 Quality Paralegal Map"
          src="https://www.google.com/maps?q=327%20NE%206th%20St%20%231,%20Grants%20Pass,%20OR%2097526&output=embed"
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </div>

    <div class="contact-page__form">
      <h2>Send a Message</h2>
      <?php if ($sent) : ?>
        <div class="alert alert--success">Thanks for submitting!</div>
      <?php elseif ($error) : ?>
        <div class="alert alert--error">Please fill in the required fields.</div>
      <?php endif; ?>

      <form class="form" method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>">
        <input type="hidden" name="action" value="a1qp_contact_form">
        <?php wp_nonce_field('a1qp_contact', 'a1qp_contact_nonce'); ?>

        <label>
          Name*
          <input type="text" name="name" required>
        </label>

        <label>
          Email*
          <input type="email" name="email" required>
        </label>

        <label>
          Phone
          <input type="text" name="phone">
        </label>

        <label>
          Message*
          <textarea name="message" rows="5" required></textarea>
        </label>

        <button class="btn btn--primary" type="submit">Send</button>
      </form>
    </div>
  </div>
</section>

<?php get_footer(); ?>
