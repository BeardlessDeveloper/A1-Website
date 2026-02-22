<?php

if (!defined('ABSPATH')) {
  exit;
}

function a1qp_setup() {
  add_theme_support('title-tag');
  add_theme_support('post-thumbnails');
  add_theme_support('custom-logo', [
    'height' => 120,
    'width' => 220,
    'flex-height' => true,
    'flex-width' => true,
  ]);

  register_nav_menus([
    'primary' => __('Primary Menu', 'a1-quality-paralegal'),
    'footer' => __('Footer Menu', 'a1-quality-paralegal'),
  ]);
}
add_action('after_setup_theme', 'a1qp_setup');

function a1qp_enqueue_assets() {
  $theme = wp_get_theme();
  wp_enqueue_style(
    'a1qp-main',
    get_template_directory_uri() . '/assets/css/main.css',
    [],
    $theme->get('Version')
  );

  wp_enqueue_script(
    'a1qp-main',
    get_template_directory_uri() . '/assets/js/main.js',
    [],
    $theme->get('Version'),
    true
  );
}
add_action('wp_enqueue_scripts', 'a1qp_enqueue_assets');

function a1qp_logo_html() {
  if (function_exists('the_custom_logo') && has_custom_logo()) {
    return get_custom_logo();
  }

  $logo_url = get_template_directory_uri() . '/assets/images/logo.png';
  $home_url = esc_url(home_url('/'));

  return '<a class="site-logo" href="' . $home_url . '"><img src="' . esc_url($logo_url) . '" alt="A1 Quality Paralegal" loading="eager" /></a>';
}

function a1qp_handle_contact_form() {
  if (!isset($_POST['a1qp_contact_nonce']) || !wp_verify_nonce($_POST['a1qp_contact_nonce'], 'a1qp_contact')) {
    wp_safe_redirect(home_url('/contact-us/?error=1'));
    exit;
  }

  $name = sanitize_text_field($_POST['name'] ?? '');
  $email = sanitize_email($_POST['email'] ?? '');
  $phone = sanitize_text_field($_POST['phone'] ?? '');
  $message = sanitize_textarea_field($_POST['message'] ?? '');

  if (!$name || !$email || !$message) {
    wp_safe_redirect(home_url('/contact-us/?error=1'));
    exit;
  }

  $to = get_option('admin_email');
  $subject = 'New Contact Request - A1 Quality Paralegal';
  $body = "Name: {$name}\nEmail: {$email}\nPhone: {$phone}\n\nMessage:\n{$message}";
  $headers = ["Reply-To: {$name} <{$email}>"];

  wp_mail($to, $subject, $body, $headers);

  wp_safe_redirect(home_url('/contact-us/?sent=1'));
  exit;
}
add_action('admin_post_nopriv_a1qp_contact_form', 'a1qp_handle_contact_form');
add_action('admin_post_a1qp_contact_form', 'a1qp_handle_contact_form');
