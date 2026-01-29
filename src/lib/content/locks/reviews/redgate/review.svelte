<script lang="ts">
	import CodeBlock from '$lib/components/code_block.svelte';
	import CodeHighlight from '$lib/components/code_highlight.svelte';

	import DropDown from '$lib/components/drop_down.svelte';
	import ImageCont from '$lib/components/image_cont.svelte';
	import Quote from '$lib/components/quote.svelte';

	// IMAGES ----------------------------
	import AddServer from '$lib/assets/Redgate/add_server.png';
	import AdminLogin from '$lib/assets/Redgate/admin.png';
	import Details from '$lib/assets/Redgate/details.png';
	import SelectPG from '$lib/assets/Redgate/select_PG.png';
</script>

<p class="p">
	<strong>TL;DR</strong> no support for lock monitoring and unpleasant developer experience. Live
	<a href="https://monitor.red-gate.com/GlobalDashboard" class="a">demo</a> for the curious.
</p>

<p class="p">
	When initially looking into Redgate, I thought it had support for lock monitoring. Apparently,
	that's for Microsoft SQL Server. Their Postgres Monitoring service scrapes a <a
		href="https://documentation.red-gate.com/monitor/list-of-metrics-239667972.html#Listofmetrics-PostgreSQLinstanceanddatabasemetrics"
		class="a">smaller set of metrics</a
	>.
</p>
<p class="p">
	As I went through the configuration process, I noticed that Postgres was an afterthought in nearly
	all the documentation. My thoughts are that Postgres is something they're exploring, but a
	secondary consideration at the moment. Overall, it's good if you're deploying SQL Server,
	Postgres, etc. all at once, but if you're just using Postgres, there are better options that are
	open source, more cost competitive, or just more comprehensive.
</p>

<p>
	I found the setup sets so frustrating that I decided to document them just in case it may help
	someone else in the future.
</p>

<DropDown title="Redgate Setup Process">
	<p class="p">For Redgate, you download two pieces of software:</p>

	<ol class="mb-8 ml-4 list-disc space-y-3">
		<li>
			<span><strong class="text-stone-900">A website:</strong> visualizes data</span>
		</li>
		<li>
			<span><strong class="text-stone-900">Monitoring tool:</strong>collects database metrics</span>
		</li>
	</ol>
	<p class="p">You must self-host both of these on your own servers.</p>

	<p class="p">The metrics trackers also needs a database to store information:</p>
	<ol class="mb-8 ml-4 list-disc space-y-3">
		<li>Microsoft SQL Server or PostgreSQL with TimescaleDB (Community Edition)</li>
	</ol>

	<p class="p">This is an overview of how it all works together</p>
	<ol class="mb-8 ml-4 list-disc space-y-3">
		<li>The website gets metrics from the monitoring software</li>
		<li>
			The monitoring software does not need to be on the same machine as your production database
			servers. Instead, it SSH's in to collect machine level metrics. It also connects to the
			Postgres server directly
		</li>
		<li>
			The monitoring software must store data somewhere. You have to host a Postgres instance
			running timescale or SQL Server to store the software's system.
		</li>
	</ol>

	<p class="p">
		It may be necessary to self-host the website, monitoring database, and metrics tracker on
		separate machines, depending on load. The configuration recommendations are outlined on their
		<a
			href="https://documentation.red-gate.com/monitor/hardware-and-performance-guidelines-239667388.html"
			class="a">website</a
		>. For simplicity, I opted to run my tests, with the site and metric scraper on the same, while
		the TimescaleDB and Postgres servers each had their own VMs.
	</p>

	<p class="p">The below instructions outlines the setup process I followed.</p>
	<Quote>
		Redgate Monitor costs over <a
			class="a"
			href="https://www.red-gate.com/products/redgate-monitor/pricing/">$1,000 a year to license.</a
		>
		If you have a business email, you can register for a
		<a class="a" href="https://www.red-gate.com/products/redgate-monitor/trial/"
			>two week free trial</a
		>.
	</Quote>
	<br /><br />
	<DropDown title="Part 1: Configuring Postgres">
		<section class="explainer_section">
			<p class="p">
				This section is based on <a
					href="https://documentation.red-gate.com/monitor14/preparing-postgresql-for-monitoring-239667737.html#PostgreSQL%20permissions"
					class="a">Redgate's Postgres Config docs</a
				>
			</p>
			<h4 class="mt-8 mb-4 text-lg font-bold text-stone-900">Create a utility database</h4>
			<p class="p">This DB will be used by Redgate for utility operations</p>
			<!-- prettier-ignore  -->
			<CodeBlock>
--Create the utility database
CREATE DATABASE redgatemonitor;
	</CodeBlock>
			<h4 class="mt-8 mb-4 text-lg font-bold text-stone-900">Create a monitoring role</h4>
			<p class="p">This role will be used by Redgate for monitoring the Postgres server</p>
			<!-- prettier-ignore  -->
			<CodeBlock>
--Create the user with basic monitoring permissions
CREATE USER redgatemonitor WITH PASSWORD 'Y0uRp@s$w0rD';
GRANT pg_monitor TO redgatemonitor;
GRANT ALL PRIVILEGES ON DATABASE redgatemonitor TO redgatemonitor;
	</CodeBlock>
			<h4 class="mt-8 mb-4 text-lg font-bold text-stone-900">Changing the postgresql.conf</h4>
			<p class="p">
				Add or update the following settings in your <CodeHighlight>postgresql.conf</CodeHighlight> file.
			</p>
			<!-- prettier-ignore  -->
			<CodeBlock>
# Modify log settings
logging_collector = on
log_destination = 'csvlog'

#Essential
auto_explain.log_format = json
auto_explain.log_level = LOG
 
#Throttle which explain plans are recorded
auto_explain.log_min_duration = 2000
auto_explain.sample_rate = 1.0
 
#Configure detail level
auto_explain.log_verbose = true
auto_explain.log_settings = true
auto_explain.log_nested_statements = true
auto_explain.log_analyze = true
auto_explain.log_buffers = true
auto_explain.log_wal = true
auto_explain.log_timing = true
auto_explain.log_triggers = true
 
#Capture io performance
track_io_timing = true
 
#Ensure the pg_stat_statements extension captures data
pg_stat_statements.track = top# Normal logs
shared_preload_libraries = 'pg_stat_statements,auto_explain'
logging_collector = on
log_destination = 'csvlog'

# Custom extension logs
#Essential
shared_preload_libraries = 'pg_stat_statements,auto_explain'
auto_explain.log_format = json
auto_explain.log_level = LOG
 
#Throttle which explain plans are recorded
auto_explain.log_min_duration = 2000
auto_explain.sample_rate = 1.0
 
#Configure detail level
auto_explain.log_verbose = true
auto_explain.log_settings = true
auto_explain.log_nested_statements = true
auto_explain.log_analyze = true
auto_explain.log_buffers = true
auto_explain.log_wal = true
auto_explain.log_timing = true
auto_explain.log_triggers = true
 
#Capture io performance
track_io_timing = true
 
#Ensure the pg_stat_statements extension captures data
pg_stat_statements.track = top
	</CodeBlock>

			<h4 class="mt-8 mb-4 text-lg font-bold text-stone-900">Restart the Postgres server</h4>
			<p class="p">This is necessary for the new config changes to finalize</p>
			<!-- prettier-ignore  -->
			<CodeBlock>
sudo systemctl restart postgresql
	</CodeBlock>
		</section>
	</DropDown>

	<DropDown title="Part 2: Configure TimescaleDB">
		<section class="explainer_section">
			<p class="p">
				To avoid conflicts, it's recommended that you configure Timescale in a seperate virtual
				machine or within a Docker container. Although this setup was just for testing, in practice,
				you normally would deploy a dedicated machine for the Redgate Database. Install TimescaleDB
				following their <a
					class="a"
					href="https://www.tigerdata.com/docs/self-hosted/latest/install/installation-linux"
					>official guide</a
				>. For configuration changes, check out the Postgres section.
			</p>
		</section>
	</DropDown>

	<DropDown title="Part 3: Installing the agent">
		<section class="explainer_section">
			<h4 class="mt-8 mb-4 text-lg font-bold text-stone-900">Create a Redgate account</h4>
			<p class="p">
				You can sign up for the trial by filling out this <a
					href="https://www.red-gate.com/products/redgate-monitor/trial/"
					class="a">form</a
				>
			</p>
			<p class="p">
				Once you complete it, your browser will automically download the installation file:
			</p>
			<!-- prettier-ignore  -->
			<CodeBlock>
RedgateMonitorLinuxX64.zip
		</CodeBlock>
			<h4 class="mt-8 mb-4 text-lg font-bold text-stone-900">Transfer the file to your VM</h4>
			<p class="p">
				Once you complete it, your browser will automically download the installation files. For
				convenience, I recommend unzipping it on your local machine instead of trying in Linux.
			</p>
			<p class="p">
				You should be able to transfer the files via the secure copy (<a
					href="https://stackoverflow.com/questions/19945881/copy-file-folder-using-scp-command"
					class="a">scp</a
				>) command
			</p>
			<!-- prettier-ignore  -->
			<CodeBlock>
scp &lt;path_to_downloaded_file&gt; root@&lt;YOUR_VM's_IP&gt;:/root/
		</CodeBlock>
			<p class="p">
				Alternatively, you can try to mail it to your VM or use another program to transfer the
				files, but SCP is the fastest approach.
			</p>
			<h4 class="mt-8 mb-4 text-lg font-bold text-stone-900">Unzip the Monitor file</h4>
			<p class="p">
				If you didn't unzip the files on your local machine, install the unzip utility:
			</p>
			<!-- prettier-ignore  -->
			<CodeBlock>
sudo apt update
sudo apt install unzip
unzip FILE_NAME
		</CodeBlock>
			<p class="p">Once you have the unzipped files, extract the agent:</p>
			<!-- prettier-ignore  -->
			<CodeBlock>
			# may have to update the version
			tar -xvzf RedgateMonitor.BaseMonitor.Linux.14.5.1.92.tar.gz
		</CodeBlock>
			<p class="p">Then run install</p>
			<CodeBlock>./install.sh</CodeBlock>
			<h4 class="mt-8 mb-4 text-lg font-bold text-stone-900">Connect the agent to TimescaleDB</h4>
			<p class="p">Once the agent is active, go the the monitor's config file:</p>
			<!-- prettier-ignore  -->
			<CodeBlock label='config file path'>
/etc/opt/redgate/redgatemonitor/redgatemonitor.conf
		</CodeBlock>
			<p class="p">And add your TimescaleDB connection string:</p>
			<!-- prettier-ignore  -->
			<CodeBlock label='config file'>
POSTGRES_REPOSITORYCONNECTIONSTRING="Host=db-host;Port=5432;Password=db-password;User Id=postgres;database=dbname"
 
#SQLSERVER_REPOSITORYCONNECTIONSTRING=Data Source=db-host;Initial Catalog=RedgateMonitor;TrustServerCertificate=true;User ID=sa;Password=password;
		</CodeBlock>
			<p class="p">If there are any issues, check the service by running the following:</p>
			<!-- prettier-ignore  -->
			<CodeBlock>
# Check server status
systemctl status redgatemonitor-base.service

# Check error logs
journalctl -xeu redgatemonitor-base.service

# Check to see what ports are active
sudo ss -tulnp
		</CodeBlock>
			<p class="p">
				Most likely, the monitor is unable to connect to TimescaleDB and you'll need to check its
				permissions.
			</p>
		</section>
	</DropDown>

	<DropDown title="Part 4: Deploying the Website">
		<section class="explainer_section">
			<h4 class="mt-8 mb-4 text-lg font-bold text-stone-900">Unzip the Website file</h4>
			<!-- prettier-ignore  -->
			<CodeBlock>
tar -xvzf RedgateMonitor.Website.Linux.14.5.1.92.tar.gz
		</CodeBlock>
			<h4 class="mt-8 mb-4 text-lg font-bold text-stone-900">Deploy the Website</h4>
			<!-- prettier-ignore  -->
			<CodeBlock>
./install.sh		
		</CodeBlock>
			<p class="p">
				Once the website is deployed, you can access it at <CodeHighlight
					>http://&lt;YOUR_VM's_IP&gt;</CodeHighlight
				>. Although it is not great that it will use HTTP, for demoing it is tolerable. Configuring
				proper SSL/TLS is non-trivial and extends beyond my aspirations for this guide.
			</p>
		</section>
	</DropDown>

	<DropDown title="Part 5: Configuring the site">
		<section class="explainer_section">
			<h4 class="mt-8 mb-4 text-lg font-bold text-stone-900">Activate your trial license</h4>
			<p class="p">
				Follow their <a
					href="https://productsupport.red-gate.com/hc/en-us/articles/4404383047441-How-to-activate-your-Redgate-Monitor-licenses"
					class="a">activation guide</a
				>.
			</p>
			<h4 class="mt-8 mb-4 text-lg font-bold text-stone-900">
				Login as an Admin or Create a New Admin
			</h4>
			<ImageCont src={AdminLogin} alt="Admin Login" />
			<h4 class="mt-8 mb-4 text-lg font-bold text-stone-900">Create a new server</h4>
			<ImageCont src={AddServer} alt="Add Server" />
			<h4 class="mt-8 mb-4 text-lg font-bold text-stone-900">
				Select Postgres as your server type
			</h4>
			<ImageCont src={SelectPG} alt="Select Postgres" />
			<h4 class="mt-8 mb-4 text-lg font-bold text-stone-900">Enter your server details</h4>
			<ImageCont src={Details} alt="Server Details" />
		</section>
	</DropDown>
</DropDown>
