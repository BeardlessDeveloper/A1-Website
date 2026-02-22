<?php
if (!defined('ABSPATH')) {
  exit;
}
?>
</main>

<footer class="site-footer">
  <div class="site-footer__inner">
    <div class="footer-brand">
      <?php echo a1qp_logo_html(); ?>
      <p class="footer-tagline">A1 Quality Paralegal LLC</p>
      <p class="footer-tagline">Personal, professional, and friendly service since 1995.</p>
    </div>

    <div class="footer-contact">
      <h3>Contact</h3>
      <ul class="footer-contact__list">
        <li>327 NE 6th St #1, Grants Pass, OR 97526</li>
        <li>541-474-2260</li>
        <li><a href="mailto:a1qualitydocuments@gmail.com">a1qualitydocuments@gmail.com</a></li>
      </ul>
    </div>

    <div class="footer-menu">
      <h3>Quick Links</h3>
      <?php
      wp_nav_menu([
        'theme_location' => 'footer',
        'container' => false,
        'menu_class' => 'footer-nav',
        'fallback_cb' => false,
      ]);
      ?>
    </div>
  </div>
  <div class="site-footer__legal">
    <p class="footer-disclaimer">*The definition excerpts provided above come directly from the Oregon State Bar web site. It is important to realize that changes may occur in this area of law. This information is not intended to be legal advice regarding your particular needs or problem, and is not intended to replace the work of an attorney. We are not attorneys and we do not offer nor do we provide legal advice. Should you require legal advice, you should contact an attorney or the Oregon State Bar Association's Lawyer referral Service at (503) 684-3763.</p>
    <p>&copy; <?php echo esc_html(date('Y')); ?> A1 Quality Paralegal. All rights reserved.</p>
  </div>
</footer>

<?php wp_footer(); ?>
</body>
</html>
