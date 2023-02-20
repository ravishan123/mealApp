import * as cdk from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';

export class MealPlanSubmissionStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    
    const table = new dynamodb.Table(this, 'MealPlanTable', {
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
    });

    
    const handler = new lambda.Function(this, 'MealPlanHandler', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'handler.submitMealPlan',
      code: lambda.Code.fromAsset('lambda'),
      environment: { TABLE_NAME: table.tableName },
    });
    table.grantWriteData(handler);
         
    const api = new apigateway.RestApi(this, 'MealPlanApi');
    const integration = new apigateway.LambdaIntegration(handler);
    api.root.addMethod('POST', integration);
  }
}