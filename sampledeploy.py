python3 deploy -e staging
    
    
def deploy:
    def __init__(self, deploy_env):
        self.deploy_env = deploy_env
        
        self.read_environment(self.deploy_env)
        self.setup_config_files()
        
        self.deploy_to_aws()
        
    def read_environment(self, env):
        if env == 'prod':
            # read prod values
        else:
            ...

    def setup_config_files(self):
        sed("DB_NAME", "prod.coherent.db", "03_custom.config")
        
    def prep_javascript(self):
        
        
    def deploy_to_aws(self):
        client = boto3.client('')
        client.deploy()