<?php
if (!defined('ABSPATH')) {
  exit;
}
get_header();
?>
<section class="content">
  <div class="content__inner">
    <?php if (have_posts()) : ?>
      <?php while (have_posts()) : the_post(); ?>
        <article <?php post_class('content__entry'); ?>>
          <h1 class="content__title"><?php the_title(); ?></h1>
          <div class="content__body">
            <?php the_content(); ?>
          </div>
        </article>
      <?php endwhile; ?>
    <?php else : ?>
      <p>Nothing found.</p>
    <?php endif; ?>
  </div>
</section>
<?php get_footer(); ?>