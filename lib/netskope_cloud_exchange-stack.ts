import * as cdk from 'aws-cdk-lib';
import { Construct} from 'constructs';


export class EcsStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.Stack) {
    super(scope, id);

// New VPC
    const vpc = new cdk.aws_ec2.Vpc
    (this, "MyVpc", {
      maxAzs: 3
    });

// New Cluster
    const cluster = new cdk.aws_ecs.Cluster(this, "MyCLuster", {
      vpc: vpc
    });

// New ECS Fargate services sd required
    new cdk.aws_ecs_patterns.ApplicationLoadBalancedFargateService(this, "MyFargateService", {
      cluster: cluster,
      cpu: 512,
      desiredCount: 4,
      taskImageOptions: {image: cdk.aws_ecs.ContainerImage.fromRegistry("amazon/amazon-ecs-sample") },
      memoryLimitMiB: 2048,
      publicLoadBalancer: true
    });

// New EFS 
    const fileSystem = new cdk.aws_efs.FileSystem(this, 'MyEfsFileSystem', {
        vpc: new cdk.aws_ec2.Vpc(this, 'VPC'),
        lifecyclePolicy: cdk.aws_efs.LifecyclePolicy.AFTER_14_DAYS, // files are not transitioned to infrequent access (IA) storage by default
        performanceMode: cdk.aws_efs.PerformanceMode.GENERAL_PURPOSE, // default
        outOfInfrequentAccessPolicy: cdk.aws_efs.OutOfInfrequentAccessPolicy.AFTER_1_ACCESS, // files are not transitioned back from (infrequent access) IA to primary storage by default
      });
  
  }
}
