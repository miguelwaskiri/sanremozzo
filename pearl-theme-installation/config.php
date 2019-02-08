<?php
/**
 * If the project path is used from the pub directory change the path to
 *
 * $bootstrapPath = __DIR__ . '/../../app/bootstrap.php';
 */
/** @var  $bootstrapPath */
$bootstrapPath = __DIR__ . '/../app/bootstrap.php';

/** CLI workaround */
$args = [];
parse_str($_SERVER['QUERY_STRING'], $args);
$_SERVER['argv'] = $args;

?>