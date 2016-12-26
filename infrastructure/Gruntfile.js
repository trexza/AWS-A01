
//---------------------------------------------------------------------------------------------------------------------
//------------------------------------------------ PARAMETERS ---------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------

module.exports = function(grunt) {

	var path = require('path');
	var package = require("./package.json");

	var creds = grunt.file.readJSON("creds.json");
	var stack_params = grunt.file.readJSON("config/stack-params.json");
	var stack_config = grunt.file.readJSON("config/stack-config.json");


	var init_params_s3 = [
		{ "ParameterKey": "BucketSuffix", "ParameterValue": stack_params.BucketSuffix },
		{ "ParameterKey": "BucketStacksPrefix", "ParameterValue": stack_params.BucketStacksPrefix },
		{ "ParameterKey": "BucketScriptsPrefix", "ParameterValue": stack_params.BucketScriptsPrefix },
		{ "ParameterKey": "BucketKeysPrefix", "ParameterValue": stack_params.BucketKeysPrefix },
        { "ParameterKey": "BucketWebContentPrefix", "ParameterValue": stack_params.BucketWebContentPrefix },
		{ "ParameterKey": "BucketBinariesPrefix", "ParameterValue": stack_params.BucketBinariesPrefix }
	];

	var init_params_foundation = [
		{ "ParameterKey": "StackName", "ParameterValue": stack_params.StackName },
		{ "ParameterKey": "NotificationEmail", "ParameterValue": stack_params.NotificationEmail },
		{ "ParameterKey": "CriticalAlertEmail", "ParameterValue": stack_params.CriticalAlertEmail },
		{ "ParameterKey": "ExternalDnsHostedZoneId", "ParameterValue": stack_params.ExternalDnsHostedZoneId },
		{ "ParameterKey": "ExternalDnsSuffix", "ParameterValue": stack_params.ExternalDnsSuffix },
		{ "ParameterKey": "InternalDnsHostedZoneId", "ParameterValue": stack_params.InternalDnsHostedZoneId },
		{ "ParameterKey": "InternalDnsSuffix", "ParameterValue": stack_params.InternalDnsSuffix },
		{ "ParameterKey": "VpcCidrBlockPrefix", "ParameterValue": getRegionCidrBlockPrefix(stack_params.Region) },
		{ "ParameterKey": "TimeZone", "ParameterValue": stack_params.TimeZone },
		{ "ParameterKey": "SingleZonePreference", "ParameterValue": stack_params.SingleZonePreference },
		{ "ParameterKey": "BucketSuffix", "ParameterValue": stack_params.BucketSuffix },
		{ "ParameterKey": "BucketStacksPrefix", "ParameterValue": stack_params.BucketStacksPrefix },
		{ "ParameterKey": "BucketScriptsPrefix", "ParameterValue": stack_params.BucketScriptsPrefix },
		{ "ParameterKey": "BucketKeysPrefix", "ParameterValue": stack_params.BucketKeysPrefix },
		{ "ParameterKey": "BucketBinariesPrefix", "ParameterValue": stack_params.BucketBinariesPrefix },
		{ "ParameterKey": "BucketWebContentPrefix", "ParameterValue": stack_params.BucketWebContentPrefix },
		{ "ParameterKey": "BastionInstanceType", "ParameterValue": stack_params.BastionInstanceType },
		{ "ParameterKey": "CreateBastion", "ParameterValue": stack_params.CreateBastion }
	];


	var init_params_nodes = [
		{ "ParameterKey": "StackName", "ParameterValue": stack_params.StackName },
		{ "ParameterKey": "Target", "ParameterValue": "Test" },
		{ "ParameterKey": "InstanceType", "ParameterValue": stack_params.InstanceType },
		{ "ParameterKey": "Role", "ParameterValue": stack_config.RoleWeb },
		{ "ParameterKey": "Profile", "ParameterValue": stack_config.ProfileWeb },
		{ "ParameterKey": "Sns", "ParameterValue": stack_config.SnsWeb },
		{ "ParameterKey": "AvailabilityZone1", "ParameterValue": stack_config.AvailabilityZone1 },
		{ "ParameterKey": "PrivateApplicationSubnetZone1", "ParameterValue": stack_config.PrivateApplicationSubnetZone1 },
		{ "ParameterKey": "PublicApplicationSubnetZone1", "ParameterValue": stack_config.PublicApplicationSubnetZone1 },
		{ "ParameterKey": "SecurityGroupLinuxServer", "ParameterValue": stack_config.SecurityGroupLinuxServer },
		{ "ParameterKey": "SecurityGroupWebApp", "ParameterValue": stack_config.SecurityGroupWebApp },
		{ "ParameterKey": "SecurityGroupWebAppElb", "ParameterValue": stack_config.SecurityGroupWebAppElb },
		{ "ParameterKey": "SecurityGroupPublicWebAccess", "ParameterValue": stack_config.SecurityGroupPublicWebAccess },
		{ "ParameterKey": "SecurityGroupRestrictedPublicWebAccess", "ParameterValue": stack_config.SecurityGroupRestrictedPublicWebAccess },
		{ "ParameterKey": "ExternalDnsHostedZoneId", "ParameterValue": stack_params.ExternalDnsHostedZoneId },
		{ "ParameterKey": "InternalDnsHostedZoneId", "ParameterValue": stack_params.InternalDnsHostedZoneId },
		{ "ParameterKey": "ExternalDnsSuffix", "ParameterValue": stack_params.ExternalDnsSuffix },
		{ "ParameterKey": "InternalDnsSuffix", "ParameterValue": stack_params.InternalDnsSuffix },
		{ "ParameterKey": "AliasElbDnsHostedZoneId", "ParameterValue": stack_params.AliasElbDnsHostedZoneId },
		{ "ParameterKey": "IntAliasElbDnsHostedZoneId", "ParameterValue": stack_params.IntAliasElbDnsHostedZoneId },
		{ "ParameterKey": "TimeZone", "ParameterValue": stack_params.TimeZone },
		{ "ParameterKey": "BucketSuffix", "ParameterValue": stack_params.BucketSuffix },
		{ "ParameterKey": "BucketKeysPrefix", "ParameterValue": stack_params.BucketKeysPrefix },
		{ "ParameterKey": "BucketScriptsPrefix", "ParameterValue": stack_params.BucketScriptsPrefix },
		{ "ParameterKey": "BucketBinariesPrefix", "ParameterValue": stack_params.BucketBinariesPrefix },
        { "ParameterKey": "BucketWebContentPrefix", "ParameterValue": stack_params.BucketWebContentPrefix },
		{ "ParameterKey": "ClusterDesiredSize", "ParameterValue": stack_params.ClusterDesiredSize },
		{ "ParameterKey": "ClusterMinSize", "ParameterValue": stack_params.ClusterMinSize },
		{ "ParameterKey": "ClusterMaxSize", "ParameterValue": stack_params.ClusterMaxSize }
	];

	/*var production_elasticsearch_parameters = [
		{ "ParameterKey": "CompanyName", "ParameterValue": stack_params.CompanyName },
		{ "ParameterKey": "CompanyLabel", "ParameterValue": stack_params.CompanyName.toLowerCase() },
		{ "ParameterKey": "Target", "ParameterValue": "production" },
		{ "ParameterKey": "InstanceType", "ParameterValue": config_production.WebappInstanceType },
		{ "ParameterKey": "Role", "ParameterValue": stack_config.RoleElasticsearch },
		{ "ParameterKey": "Profile", "ParameterValue": stack_config.ProfileElasticsearch },
		{ "ParameterKey": "Sns", "ParameterValue": stack_config.SnsElasticsearch },
		{ "ParameterKey": "AvailabilityZone1", "ParameterValue": stack_config.AvailabilityZone1 },
		{ "ParameterKey": "AvailabilityZone2", "ParameterValue": stack_config.AvailabilityZone2 },
		{ "ParameterKey": "PrivateApplicationSubnetZone1", "ParameterValue": stack_config.PrivateApplicationSubnetZone1 },
		{ "ParameterKey": "PrivateApplicationSubnetZone2", "ParameterValue": stack_config.PrivateApplicationSubnetZone2 },
		{ "ParameterKey": "PublicApplicationSubnetZone1", "ParameterValue": stack_config.PublicApplicationSubnetZone1 },
		{ "ParameterKey": "PublicApplicationSubnetZone2", "ParameterValue": stack_config.PublicApplicationSubnetZone2 },
		{ "ParameterKey": "SecurityGroupLinuxServer", "ParameterValue": stack_config.SecurityGroupLinuxServer },
		{ "ParameterKey": "SecurityGroupElasticsearch", "ParameterValue": stack_config.SecurityGroupElasticsearch },
		{ "ParameterKey": "SecurityGroupElasticsearchElb", "ParameterValue": stack_config.SecurityGroupElasticsearchElb },
		{ "ParameterKey": "InternalDnsHostedZoneId", "ParameterValue": stack_params.InternalDnsHostedZoneId },
		{ "ParameterKey": "InternalDnsSuffix", "ParameterValue": stack_params.InternalDnsSuffix },
		{ "ParameterKey": "TimeZone", "ParameterValue": config_production.TimeZone },
		{ "ParameterKey": "NewRelicLicenseKey", "ParameterValue": creds.NewRelicLicenseKey },
		{ "ParameterKey": "BucketSuffix", "ParameterValue": stack_params.BucketSuffix },
		{ "ParameterKey": "BucketKeysPrefix", "ParameterValue": stack_params.BucketKeysPrefix },
		{ "ParameterKey": "BucketScriptsPrefix", "ParameterValue": stack_params.BucketScriptsPrefix },
		{ "ParameterKey": "BucketBinariesPrefix", "ParameterValue": stack_params.BucketBinariesPrefix },
		{ "ParameterKey": "ClusterDesiredSize", "ParameterValue": config_production.ElasticsearchClusterDesiredSize },
		{ "ParameterKey": "ClusterMinSize", "ParameterValue": config_production.ElasticsearchClusterMinSize },
		{ "ParameterKey": "ClusterMaxSize", "ParameterValue": config_production.ElasticsearchClusterMaxSize },
		{ "ParameterKey": "DnsNamePrefix", "ParameterValue": config_production.ElasticsearchDnsNamePrefix }
	];*/

//---------------------------------------------------------------------------------------------------------------------
//------------------------------------------------ TASK CONFIG --------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------

	grunt.initConfig({

		pkg: grunt.file.readJSON("package.json"),

		clean: {
            dist: {
            	src: [ "dist" ]
            },
            openvpn: {
            	src: [ "tools" ]
            }
        },

        copy: {
        	dist: {
        		files: [
        			{ expand: true, cwd: "src", src: "**/*", dest: "dist" }
        		]
        	}
        },

		s3: {
			stack: {
				options: {
					"accessKeyId": creds.AccessKeyId,
					"secretAccessKey": creds.SecretAccessKey,
					"region": stack_params.Region,
					"bucket": stack_params.BucketStacksPrefix + "-" + getRegionName(stack_params.Region) + "-" + stack_params.BucketSuffix,
					"access": "private",
					"gzip": false,
					"overwrite": true,
					"cache": false
				},
				"cwd": "dist/stack",
				"src": "**/*"
			},
			script: {
				options: {
					"accessKeyId": creds.AccessKeyId,
					"secretAccessKey": creds.SecretAccessKey,
					"region": stack_params.Region,
					"bucket": stack_params.BucketScriptsPrefix + "-" + getRegionName(stack_params.Region) + "-" + stack_params.BucketSuffix,
					"access": "private",
					"gzip": false,
					"overwrite": true,
					"cache": false
				},
				"cwd": "dist/script",
				"src": "**/*"
			},
			keys: {
				options: {
					"accessKeyId": creds.AccessKeyId,
					"secretAccessKey": creds.SecretAccessKey,
					"region": stack_params.Region,
					"bucket": stack_params.BucketKeysPrefix + "-" + getRegionName(stack_params.Region) + "-" + stack_params.BucketSuffix,
					"access": "private",
					"gzip": false,
					"overwrite": true,
					"cache": false
				},
				"cwd": "dist/keys",
				"src": "**/*"
			},
            web: {
                options: {
                    "accessKeyId": creds.AccessKeyId,
                    "secretAccessKey": creds.SecretAccessKey,
                    "region": stack_params.Region,
                    "bucket": stack_params.BucketWebContentPrefix + "-" + getRegionName(stack_params.Region) + "-" + stack_params.BucketSuffix,
                    "access": "private",
                    "gzip": false,
                    "overwrite": true,
                    "cache": false
                },
                "cwd": "dist/web",
                "src": "**/*"
            }
		},

        processTemplate: {
        	s3_buckets: {
				"src": "dist/stack/s3/s3-stackbuckets.template",
        		"key": "s3-buckets"
        	},
        	elastic_IPs: {
				"src": "dist/stack/network/eip.template",
        		"key": "elasticIPs"
        	},
        	foundation: {
				"src": "dist/stack/awsa01-stack.template",
        		"key": "foundation"
        	},
			webNodes: {
				"src": "dist/stack/web/ec2-webproxy.template",
				"key": "webNodes"
			},
        	appNodes: {
        		"src": "dist/stack/app/ec2-app.template",
        		"key": "appNodes"
        	},
        	elasticsearch: {
        		"src": "dist/stack/app/elasticsearch.json",
        		"key": "elasticsearch"
        	}
        },

        createStack: {
			s3_buckets: {
				"name": stack_params.StackName.toLowerCase() + "-s3-buckets",
				"templateKey": "s3-buckets",
				"outputKey": "s3-buckets.out",
				"region": stack_params.Region,
				"parameters": init_params_s3
			},
			elastic_IPs: {
				"name": stack_params.StackName.toLowerCase() + "-elasticIPs",
				"templateKey": "elasticIPs",
				"outputKey": "eip-config.out",
				"region": stack_params.Region
			},
			foundation: {
				"name": stack_params.StackName.toLowerCase() + "-base-stack",
				"templateKey": "foundation",
				"outputKey": "foundation.out",
				"region": stack_params.Region,
				"capabilities": [ "CAPABILITY_IAM" ],
				"parameters": init_params_foundation
			},
			webNodes: {
				"name": stack_params.StackName.toLowerCase() + "-web-proxy",
				"templateKey": "webNodes",
				"outputKey": "web.out",
				"region": stack_params.Region,
				"capabilities": [ "CAPABILITY_IAM" ],
				"parameters": init_params_nodes
			},
			appNodes: {
				"name": stack_params.StackName.toLowerCase() + "-app-nodes",
				"templateKey": "appNodes",
				"outputKey": "app.out",
				"region": stack_params.Region,
				"capabilities": [ "CAPABILITY_IAM" ],
				"parameters": init_params_nodes
			},
			/*production_elasticsearch: {
				"name": stack_params.CompanyName.toLowerCase() + "-production-elasticsearch",
				"templateKey": "elasticsearch",
				"outputKey": "production-elasticsearch.out",
				"region": stack_params.Region,
				"capabilities": [ "CAPABILITY_IAM" ],
				"parameters": production_elasticsearch_parameters
			}*/
		},

		updateStack: {
			s3_buckets: {
				"name": stack_params.StackName.toLowerCase() + "-s3-buckets",
				"templateKey": "s3-buckets",
				"outputKey": "s3-buckets.out",
				"region": stack_params.Region,
				"parameters": init_params_s3
			},
			elastic_IPs: {
				"name": stack_params.StackName.toLowerCase() + "-elasticIPs",
				"templateKey": "elasticIPs",
				"outputKey": "eip-config.out",
				"region": stack_params.Region
			},
			foundation: {
				"name": stack_params.StackName.toLowerCase() + "-base-stack",
				"templateKey": "foundation",
				"outputKey": "foundation.out",
				"region": stack_params.Region,
				"capabilities": [ "CAPABILITY_IAM" ],
				"parameters": init_params_foundation
			},
            webNodes: {
                "name": stack_params.StackName.toLowerCase() + "-web-proxy",
                "templateKey": "webNodes",
                "outputKey": "web.out",
                "region": stack_params.Region,
                "capabilities": [ "CAPABILITY_IAM" ],
                "parameters": init_params_nodes
            },
			appNodes: {
				"name": stack_params.StackName.toLowerCase() + "-app-nodes",
				"templateKey": "appNodes",
				"outputKey": "app.out",
				"region": stack_params.Region,
				"capabilities": [ "CAPABILITY_IAM" ],
				"parameters": init_params_nodes
			},
			/*production_elasticsearch: {
				"name": stack_params.CompanyName.toLowerCase() + "-production-elasticsearch",
				"templateKey": "elasticsearch",
				"outputKey": "production-elasticsearch.out",
				"region": stack_params.Region,
				"capabilities": [ "CAPABILITY_IAM" ],
				"parameters": production_elasticsearch_parameters
			}*/
		},

		deleteStack: {
			integration_app: {
				"region": stack_params.Region
			}
		}
    });

	grunt.loadNpmTasks("grunt-contrib-clean");
	grunt.loadNpmTasks("grunt-contrib-copy");
	grunt.loadNpmTasks("grunt-aws");
	grunt.loadNpmTasks("grunt-niteo-awscloudformation");


	grunt.registerTask("init_stacks", function() {

		grunt.file.mkdir("dist");
	});
	

	grunt.registerTask("post_dist", function() {

		var stacks = [
			"s3/s3-stackbuckets.template",
			"awsa01-stack.template",
			"network/vpc-main.template",
			"network/vpc-security.template",
			"network/eip.template",
			"network/bastion/vpc-bastion-shared.template",
			"network/bastion/vpc-bastion-single.template",
			"web/ec2-webproxy.template",
			"app/IAM.template",
			"app/ec2-app.template"
		];

		for(var i=0; i<stacks.length; i++) {

			var stack = grunt.file.readJSON("dist/stack/" + stacks[i]);
			stack.Description = stack_params.StackName + " " + stack.Description;
			grunt.file.write("dist/stack/" + stacks[i], JSON.stringify(stack, null, null));
		}
	});

//---------------------------------------------------------------------------------------------------------------------
//------------------------------------------------ SET AND UNSET AWS CREDS --------------------------------------------
//---------------------------------------------------------------------------------------------------------------------

	grunt.registerTask("setcreds", function() {

		grunt.file.write(process.env['HOME'] + "/.aws/credentials", "[default]\naws_access_key_id = " + creds.AccessKeyId + "\n" + "aws_secret_access_key = " + creds.SecretAccessKey + "\n");
		grunt.file.write(process.env['HOME'] + "/.aws/config", "[default]\naws_access_key_id = " + creds.AccessKeyId + "\n" + "aws_secret_access_key = " + creds.SecretAccessKey + "\n");
	});

	grunt.registerTask("unsetcreds", function() {

		grunt.file.write(process.env['HOME'] + "/.aws/credentials", "");
		grunt.file.write(process.env['HOME'] + "/.aws/config", "");
	});


//---------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------- CREATE TASKS --------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------


	// *****************************************************************************************************************
	// ************************************************ STEP 1 *********************************************************
	//
	// One time task for creating the s3 buckets which will hold all the infrastructure code
	// You need to execute this only once for any number of regions

	grunt.registerTask("create_s3buckets", [ "clean:dist", "init_stacks", "copy:dist", "post_dist", "processTemplate:s3_buckets", "createStack:s3_buckets" ]);



	// *****************************************************************************************************************
	// ************************************************ STEP 2 *********************************************************
	//
	// Task for uploading the infrastructure code to S3 (templates, scripts, binaries).
	// These are are referred by other tasks and templates in the succeeding steps
	// Execute this task before creating or updating any part of the stack

	grunt.registerTask("copy_scripts", ["clean:dist", "init_stacks", "copy:dist", "post_dist", "s3:stack", "s3:script", "s3:keys", "s3:web" ]);



	// *****************************************************************************************************************
	// ************************************************ STEP 3 *********************************************************
	//
	// Task for Creating Foundation Services
	// Validates the templates and creates the following
	// 		1. S3 Buckets
	//		2. Elastic IPs for accessing Jenkins from internet
	//		3. VPC zone, private and public subnets
	//		4. Security groups
	// @See - create_eips, create_foundation_stack

	grunt.registerTask("create_foundation_services", [ "clean:dist", "init_stacks", "copy:dist", "post_dist", "create_eips", "write-eip-config", "create_foundation_stack", "write-stack-config" ]);



	// *****************************************************************************************************************
	// ************************************************ STEP 4 *********************************************************
	//
	// Task for Creating Jenkins Instances
	// Validates the templates and creates the following
	// 		1. Elastic Loadbalancer
	//		2. Launch Configuration for the Jenkins instance
	//		3. Auto Scaling configuration for the Jenkins node
	//		4. Attaches instance to ELB

	grunt.registerTask("create_web", [ "clean:dist", "init_stacks", "copy:dist", "post_dist", "processTemplate:webNodes", "createStack:webNodes" ]);



	// *****************************************************************************************************************
	// ************************************************ STEP 4 *********************************************************
	//
	// Task for Creating Jenkins Instances
	// Validates the templates and creates the following
	// 		1. Elastic Loadbalancer
	//		2. Launch Configuration for the Jenkins instance
	//		3. Auto Scaling configuration for the Jenkins node
	//		4. Attaches instance to ELB

	grunt.registerTask("create_app", [ "clean:dist", "init_stacks", "copy:dist", "post_dist", "processTemplate:appNodes", "createStack:appNodes" ]);


	// *****************************************************************************************************************
	// ************************************************ HELPERS ********************************************************
	//

	// Helper task for create_foundation_services
	grunt.registerTask("create_eips", [ "processTemplate:elastic_IPs", "createStack:elastic_IPs" ]);


	// Helper task for create_foundation_services
	grunt.registerTask("create_foundation_stack", function() {

		var outputs = grunt.option("eip-config.out").Outputs;
		var natGateway01EipAloocationId;

		for(var i=0; i<outputs.length; i++) {
			var key = outputs[i].OutputKey;
			if(key == "EipNatGateway01AllocationId") {
				natGateway01EipAloocationId = outputs[i].OutputValue;
			}
		}

		var parameters = grunt.config.get("createStack.foundation.parameters");
		parameters.push({ "ParameterKey": "EipNatGateway01AllocationId", "ParameterValue": natGateway01EipAloocationId });
		grunt.config.set("createStack.foundation.parameters", parameters);

		grunt.task.run([ "processTemplate:foundation", "createStack:foundation" ]);
	});



//---------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------- UPDATE TASKS --------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------

	// *****************************************************************************************************************
	// ************************************************ MAIN TASKS *****************************************************
	//
	grunt.registerTask("update_s3buckets", [ "clean:dist", "init_stacks", "copy:dist", "post_dist", "processTemplate:s3_buckets", "updateStack:s3_buckets" ]);

	grunt.registerTask("update_foundation_services", [ "clean:dist", "init_stacks", "copy:dist", "post_dist", "update_eips", "write-eip-config", "update_foundation_stack", "write-stack-config" ]);

	grunt.registerTask("update_app", [ "clean:dist", "init_stacks", "copy:dist", "post_dist", "processTemplate:appNodes", "updateStack:appNodes" ]);

    grunt.registerTask("update_web", [ "clean:dist", "init_stacks", "copy:dist", "post_dist", "processTemplate:webNodes", "updateStack:webNodes" ]);

	// *****************************************************************************************************************
	// ************************************************ HELPERS ********************************************************
	//
	grunt.registerTask("update_eips", [ "processTemplate:elastic_IPs", "updateStack:elastic_IPs" ]);

	grunt.registerTask("update_foundation_stack", function() {

		var outputs = grunt.option("eip-config.out").Outputs;
		var natGateway01EipAloocationId;

		for(var i=0; i<outputs.length; i++) {
			var key = outputs[i].OutputKey;
			if(key == "EipNatGateway01AllocationId") {
				natGateway01EipAloocationId = outputs[i].OutputValue;
			}
		}

		var parameters = grunt.config.get("updateStack.foundation.parameters");
		parameters.push({ "ParameterKey": "EipNatGateway01AllocationId", "ParameterValue": natGateway01EipAloocationId });
		grunt.config.set("updateStack.foundation.parameters", parameters);

		grunt.task.run([ "processTemplate:foundation", "updateStack:foundation" ]);
	});



	// production write outputs

	grunt.registerTask("write-eip-config", function() {

		var outputs = grunt.option("eip-config.out").Outputs;
		var config = {};

		for(var i=0; i<outputs.length; i++) {
			config[outputs[i].OutputKey] = outputs[i].OutputValue;
		}

		grunt.file.write("config/stack-config.json", JSON.stringify(config, null, 4));
	});

	grunt.registerTask("write-stack-config", function() {

		var outputs = grunt.option("foundation.out").Outputs;
		var config = {};

		for(var i=0; i<outputs.length; i++) {
			config[outputs[i].OutputKey] = outputs[i].OutputValue;
		}

		grunt.file.write("config/stack-config.json", JSON.stringify(config, null, 4));
	});


//---------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------ TASK API -----------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------

	grunt.registerTask("dist", [ "clean:dist", "init_stacks", "copy:dist", "post_dist" ]);

//grunt.registerTask("push", [ "clean:dist", "init_stacks", "copy:dist", "post_dist", "s3:stack", "s3:script" ]);

	grunt.registerTask("push", [ "s3:stack", "s3:script" ]);

	grunt.registerTask("create", function(name) {

		grunt.task.run("create_" + name);
	});

	grunt.registerTask("update", function(name) {

		grunt.task.run("update_" + name);
	});
}


//---------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------ UTILS --------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------

var getRegionName = function(region) {

	var regionName;

	switch(region) {

		case "us-east-1":
			regionName = "virginia";
			break;
		case "us-west-1":
			regionName = "california";
			break;
		case "us-west-2":
			regionName = "oregon";
			break;
		case "eu-west-1":
			regionName = "ireland";
			break;
		case "eu-central-1":
			regionName = "frankfurt";
			break;
		case "ap-northeast-1":
			regionName = "japan";
			break;
		case "ap-southeast-1":
			regionName = "singapore";
			break;
		case "ap-southeast-2":
			regionName = "sydney";
			break;
		case "sa-east-1":
			regionName = "brazil";
			break;
	}

	return regionName;
};

var getRegionCidrBlockPrefix = function(region) {

	var cidrPrefix;

	switch (region) {

		case "us-east-1":
			cidrPrefix = "10.1";
			break;
		case "us-west-1":
			cidrPrefix = "10.2";
			break;
		case "us-west-2":
			cidrPrefix = "10.3";
			break;
		case "eu-west-1":
			cidrPrefix = "10.4";
			break;
		case "eu-central-1":
			cidrPrefix = "10.5";
			break;
		case "ap-northeast-1":
			cidrPrefix = "10.6";
			break;
		case "ap-southeast-1":
			cidrPrefix = "10.7";
			break;
		case "ap-southeast-2":
			cidrPrefix = "10.8";
			break;
		case "sa-east-1":
			cidrPrefix = "10.9";
			break;
	}

	return cidrPrefix;

};

var getVnpPrimaryPushRoute = function(region){

	var pushRoute = getRegionCidrBlockPrefix(region)+".0.0 255.255.0.0";

	return pushRoute;

};

//---------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------ DELETE -------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------

//grunt.registerTask("create_s3buckets", [ "clean:dist", "init_stacks", "copy:dist", "post_dist", "processTemplate:s3_buckets", "createStack:s3_buckets" ]);

// webapp tasks

//grunt.registerTask("update_foundation_services", [ "processTemplate:production_prereqs", "updateStack:production_prereqs" ]);

// elasicsearch tasks

//grunt.registerTask("create_elasticsearch", [ "processTemplate:elasticsearch", "createStack:production_elasticsearch" ]);

//grunt.registerTask("update_elasticsearch", [ "processTemplate:elasticsearch", "updateStack:production_elasticsearch" ]);

// production vpc create tasks

//grunt.registerTask("create_foundation_services", [ "clean:dist", "init_stacks", "copy:dist", "post_dist", "create_production_prereqs", "write-production-prereqs-config", "create_production_main", "write-production-config" ]);

// production vpc update tasks