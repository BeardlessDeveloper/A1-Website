<?php
if (!defined('ABSPATH')) {
  exit;
}
?>
<!doctype html>
<html <?php language_attributes(); ?>>
<head>
  <meta charset="<?php bloginfo('charset'); ?>" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>
<a class="skip-link" href="#main">Skip to Main Content</a>

<header class="site-header">
  <div class="site-header__inner">
    <div class="site-brand">
      <?php echo a1qp_logo_html(); ?>
    </div>

    <nav class="site-nav" aria-label="Site">
      <?php
      wp_nav_menu([
        'theme_location' => 'primary',
        'container' => false,
        'menu_class' => 'site-nav__list',
        'fallback_cb' => function () {
          echo '<ul class="site-nav__list">';
          echo '<li><a href="' . esc_url(home_url('/')) . '">Home</a></li>';
          echo '<li><a href="' . esc_url(home_url('/estate-planning/')) . '">Estate Planning</a></li>';
          echo '<li><a href="' . esc_url(home_url('/bookings/')) . '">Book an Appointment</a></li>';
          echo '<li><a href="' . esc_url(home_url('/contact-us/')) . '">Contact Us</a></li>';
          echo '</ul>';
        },
      ]);
      ?>
    </nav>
  </div>
</header>

<main id="main" class="site-main" role="main">