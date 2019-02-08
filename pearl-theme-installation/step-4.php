<?php
set_time_limit(0);

require_once __DIR__ . DIRECTORY_SEPARATOR . 'config.php';

$result = array(
    'msg' => '',
    'error' => false
);


try {
    require $bootstrapPath;
} catch (\Exception $e) {
    echo <<<HTML
<div style="font:12px/1.35em arial, helvetica, sans-serif;">
    <div style="margin:0 0 25px 0; border-bottom:1px solid #ccc;">
        <h3 style="margin:0;font-size:1.7em;font-weight:normal;text-transform:none;text-align:left;color:#2f2f2f;">
        Autoload error</h3>
    </div>
    <p>{$e->getMessage()}</p>
</div>
HTML;
    exit(1);
}


if (!isset($_POST['storeCode'])) {
    $result['error'] = true;
    $result['msg'] = 'Please specify the store code!';
    echo json_encode($result);
    die;
}

if (!isset($_POST['demoVersion'])) {
    $result['error'] = true;
    $result['msg'] = 'Please specify the demo version!';
    echo json_encode($result);
    die;
}

$bootstrap = \Magento\Framework\App\Bootstrap::create(BP, $_SERVER);
$objectManager = $bootstrap->getObjectManager();

$cli = $objectManager->get('Magento\Framework\Console\Cli');
$cli->setAutoExit(false);

$applicationName = 'Pearl Installation';
$commands = [
    'weltpixel:import:demo' => [
        '--store='.$_POST['storeCode'],
        '--demoVersion='.$_POST['demoVersion']
    ],
    'weltpixel:less:generate' => [],
    'cache:clean' => []
];


$resultMsg = '';

try {
    foreach ($commands as $command => $params) {
        $argvInputParams = [$applicationName, $command];
        foreach ($params as $param) {
            $argvInputParams[] = $param;
        }

        $input = new \Symfony\Component\Console\Input\ArgvInput($argvInputParams);

        $output = new Symfony\Component\Console\Output\BufferedOutput();
        $cli->run($input, $output);

        $content = $output->fetch();

        $resultMsg .= str_replace(PHP_EOL, "<br/>", $content);
    }

    $result['msg'] = $resultMsg;
} catch (Exception $ex) {
    $result['msg'] = $ex->getMessage();
    $result['error'] = true;
}

if (strpos($result['msg'], 'Exception') !== false) {
    $result['error'] = true;
}


echo json_encode($result);
die;