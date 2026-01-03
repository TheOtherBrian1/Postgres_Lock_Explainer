<script lang="ts">
	// COMPONENTS -----------------------
	import CodeBlock from '$lib/components/code_block.svelte';
	import CodeHighlight from '$lib/components/code_highlight.svelte';
	import SectionHeader from '$lib/components/section_header.svelte';
	import DropDown from '$lib/components/drop_down.svelte';
	import Image from '$lib/components/image_cont.svelte';
	import Quote from '$lib/components/quote.svelte';

	// IMAGES ---------------------------
	import new_project from '$lib/assets/new_project.png';
	import pick_ubuntu from '$lib/assets/pick_ubuntu.png';
	import new_server from '$lib/assets/new_server.png';
	import IPv4 from '$lib/assets/IPv4.png';
</script>

<article
	class="mx-auto mb-10 max-w-[1000px] rounded-2xl border border-stone-100 bg-white/95 p-6 font-sans leading-relaxed text-stone-600 shadow-sm selection:bg-[#FF3E00] selection:text-white md:p-12"
>
	<section class="explainer_section">
		<SectionHeader>Monitoring Locks</SectionHeader>

		<p class="p">
			Locks, as stated in other sections, generally do not cause issues, but they can sometimes make
			relatively fast queries slow. For instance, if a query normally runs for 1ms, but is often
			blocked by another that takes 1s, then the fast query will functionally complete at 1s even
			though it could finish faster.
		</p>
		<p class="p">There are a lot of popular tools for monitoring Postgres performance</p>
		<p class="p">
			I went through the process of investigating the most recognizable to see how much visibility
			they gave over locking.
		</p>
		<ul class="mb-10 ml-4 list-disc space-y-2">
			<li class="pl-4">
				<strong class="mb-1 block text-stone-900">
					<a class="a text-stone-900" href="https://pganalyze.com/">PGAnalyze</a>
				</strong>
			</li>

			<li class="pl-4">
				<strong class="mb-1 block text-stone-900">
					<a
						class="a text-stone-900"
						href="https://www.datadoghq.com/monitoring/postgresql-monitoring/">DataDog</a
					>
				</strong>
			</li>

			<li class="pl-4">
				<strong class="mb-1 block text-stone-900">
					<a
						class="a text-stone-900"
						href="http://learn.netdata.cloud/docs/collecting-metrics/databases/postgresql"
						>NetData</a
					>
				</strong>
			</li>

			<li class="pl-4">
				<strong class="mb-1 block text-stone-900">
					<a class="a text-stone-900" href="https://www.red-gate.com/products/redgate-monitor/"
						>Redgate Monitor</a
					>
				</strong>
			</li>

			<li class="pl-4">
				<strong class="mb-1 block">
					<a class="a text-stone-900" href="https://github.com/darold/pgbadger">PGBadger</a>
				</strong>
			</li>
			<li class="pl-4">
				<strong class="mb-1 block">
					<a
						class="a text-stone-900"
						href="https://www.cybertec-postgresql.com/en/products/pgwatch-postgresql-monitoring/"
						>PGWatch</a
					>
				</strong>
			</li>
			<li class="pl-4">
				<strong class="mb-1 block">
					<a class="a text-stone-900" href="https://github.com/ankane/pghero">PGHero</a>
				</strong>
			</li>
			<li class="pl-4">
				<strong class="mb-1 block">
					<a
						class="a text-stone-900"
						href="https://www.percona.com/software/database-tools/percona-monitoring-and-management/postgresql-monitoring"
						>Percona Monitor</a
					>
				</strong>
			</li>
		</ul>
	</section>
	<section class="explainer_section">
		<SectionHeader>Review process</SectionHeader>

		<p class="p">
			For my review process, I created a few throwaway Postgres servers on <a
				class="a"
				href="https://hetzner.cloud/?ref=rTQwfR1oZc81">Hertzner</a
			> to deploy the software to. I wanted full control over the system just in case I needed to apply
			any special configurations to get everything to work. If you're curious to repeat the deployment
			steps, I documented the set up process below.
		</p>

		<DropDown title="Hertzner Setup">
			<section class="explainer_section">
				<SectionHeader>Deploying a server on Hertzner</SectionHeader>
				<Quote>
					Note: to connect to the server, you will need to use SSH. Here's a <a
						href="https://uchicago-cs.github.io/student-resource-guide/vscode/ssh.html"
						class="a">guide</a
					>
					to use SSH with VSCode. You must also know how to work in a terminal/command_line environment.
				</Quote>
				<h4 class="mt-8 mb-4 text-lg font-bold text-stone-900">
					1. Create a <a class="a font-bold" href="https://hetzner.cloud/?ref=rTQwfR1oZc81"
						>Hertzner Account</a
					>
				</h4>
				<h4 class="mt-8 mb-4 text-lg font-bold text-stone-900">
					2. Create a new <a class="a font-bold" href="https://console.hetzner.cloud/projects"
						>Cloud</a
					> project
				</h4>
				<Image src={new_project} alt="creating a new project" />
				<h4 class="mt-8 mb-4 text-lg font-bold text-stone-900">3. Create a new server</h4>
				<div class="pl-4">
					<p class="p">
						You will be given a few options for configurations. Outside of IPv4 and the Linux
						Flavor, you can go with the defaults. Feel free to pick the most affordable server, too.
					</p>
					<Image src={new_server} alt="creating a new server" />
				</div>
				<h4 class="mt-8 mb-4 text-lg font-bold text-stone-900">
					Select Ubuntu for your Linux flavor
				</h4>
				<div class="pl-4">
					<Image src={pick_ubuntu} alt="selecting Ubuntu" />
				</div>
				<h4 class="mt-8 mb-4 text-lg font-bold text-stone-900">Enable IPv4</h4>
				<div class="pl-4">
					<p class="p">
						Some of the providers I tested were not yet IPv6 compliant, so IPv4 is necessary.
					</p>
					<Image src={IPv4} alt="enabling IPv4" />
				</div>
				<h4 class="mt-8 mb-4 text-lg font-bold text-stone-900">Deploy</h4>
				<div class="pl-4">
					<p class="p">
						Once the server is up and running, you should receive an email with your SSH configs,
						assuming you didn't manually set up SSH beforehand.
					</p>
				</div>
			</section>
		</DropDown>
		<DropDown title="Postgres Setup">
			<section class="explainer_section">
				<SectionHeader>Deploying Postgres to Ubuntu</SectionHeader>
				<p class="p">
					Although one could go through the effort of <a
						href="https://medium.com/@bbrenng1/compiling-postgres-from-source-on-ubuntu-a2cbf0235878"
						class="a">compiling PG from source</a
					>, one could also just use Ubuntu's package manager to quickly deploy it. At the time of
					writing, Hertzner Ubuntu targets PG16 by default. This was fine for tests, especially
					because some tools, such as Redgate and Datadog are not yet compatible with PG18 (the
					latest release).
				</p>
				<h4 class="mt-8 mb-4 text-lg font-bold text-stone-900">Install PG from the terminal</h4>
				<div class="pl-4">
					<!-- prettier-ignore  -->
					<CodeBlock>
sudo apt update
sudo apt install postgresql-16 -y
                    </CodeBlock>
				</div>

				<h4 class="mt-8 mb-4 text-lg font-bold text-stone-900">Reconfigure the pg_hba.conf file</h4>
				<div class="pl-4">
					<p class="p">
						The <CodeHighlight>pg_hba.conf</CodeHighlight> file determines who's allowed to connect to
						your Postgres server. If too strictly configured, the services will not be able to connect.
						If too loosely configured, you will likely be hacked by bots. While exploring these services,
						bots actually tried to hack me over 1,000 times, so this step is actually critical.
					</p>
					<p class="p">The file can be found in the path:</p>
					<CodeBlock label="pg_hba.conf">/etc/postgresql/16/main/pg_hba.conf</CodeBlock>
					<p class="p">
						Append the below settings. On top of the default settings, which allow you to connect
						from within the machine, the new ones tell the server to also accept encrypted password
						authentication from external IPs
					</p>
					<!-- prettier-ignore  -->
					<CodeBlock label='pg_hba.conf'>
# Block all online connections that do not use SSL
hostnossl    all        all             all                     reject

# Allow requests from anywhere using SSL
hostssl      all        all            0.0.0.0/0                scram-sha-256
hostssl      all        all            ::0/0                    scram-sha-256
                    </CodeBlock>
				</div>
				<h4 class="mt-8 mb-4 text-lg font-bold text-stone-900">Modify the postgresql.conf file</h4>
				<div class="pl-4">
					<p class="p">
						This file determines server settings. Below's is the path to its default location
					</p>
					<CodeBlock label="postgresql.conf">/etc/postgresql/16/main/postgresql.conf</CodeBlock>
					<p class="p">
						Change the <CodeHighlight>listen_addresses</CodeHighlight> setting to '*', so that any external
						IP can attempt to connect. Although not best practice, it simplifies the process of configuring
						the monitoring tools.
					</p>
					<CodeBlock>listen_addresses = '*' # what IP address(es) to listen on</CodeBlock>
					<p class="p">
						Then go to the website <a class="a" href="https://pgtune.leopard.in.ua/">pgtune</a> and change
						your other settings based on its recommendations. Then restart the database, so the changes
						take affect.
					</p>
					<CodeBlock label="restart PG">sudo systemctl restart postgresql</CodeBlock>
				</div>
				<h4 class="mt-8 mb-4 text-lg font-bold text-stone-900">
					PSQL into PG and alter your password
				</h4>
				<div class="pl-4">
					<p class="p">
						Ubuntu creates a new Linux user <CodeHighlight>postgres</CodeHighlight> that can access the
						DB by default. Impersonate that user with the <CodeHighlight>su</CodeHighlight> command
					</p>
					<CodeBlock label="impersonate">su postgres</CodeBlock>
					<p class="p">Then PSQL into the instance:</p>
					<CodeBlock label="impersonate">psql</CodeBlock>
					<p class="p">
						Alter the Postgres role's password (do not forget it). The database is a dummy instance,
						so it doesn't need to be too sophisticated, but it shouldn't be simple enough that one
						of the many scraping bots that target exposed PG servers could guess it in a few hundred
						tries.
					</p>
					<CodeBlock label="impersonate"
						>ALTER ROLE postgres WITH password 'your_new_password';</CodeBlock
					>
					<p class="p">Exit the PSQL session</p>
					<CodeBlock label="impersonate">exit</CodeBlock>
					<p class="p">
						Then run <CodeHighlight>exit</CodeHighlight> again to stop impersonating the postgres Linux
						user
					</p>
					<CodeBlock label="impersonate">exit</CodeBlock>
				</div>
				<h4 class="mt-8 mb-4 text-lg font-bold text-stone-900">
					Change your environment variables for Postgres. It makes it simpler to connect from within
					your machine.
				</h4>
				<div class="pl-4">
					<!-- prettier-ignore  -->
					<CodeBlock>
export PGHOST=localhost
export PGPORT=5432
export PGPASSWORD=&lt;password&gt;
export PGDATABASE=postgres
export PGUSER=postgres
                    </CodeBlock>
				</div>
			</section>
		</DropDown>

		<p class="p">
			To test locks, I set up a <a
				href="https://www.postgresql.org/docs/current/pgbench.html"
				class="a">PGBench</a
			> test script to generate problematic locks. If you're unfamiliar with PGBench, it's a benchmarking
			tool that comes bundled with Postgres. The setup process I used is documented below.
		</p>
		<DropDown title="PGBench Setup">
			<section class="explainer_section">
				<SectionHeader>Configuring PGBench</SectionHeader>
				<h4 class="mt-8 mb-4 text-lg font-bold text-stone-900">
					Create a folder as the root user to hold your scripts
				</h4>
				<div class="pl-4">
					<CodeBlock title="pgbench folder">mkdir pgbench_scripts</CodeBlock>
				</div>

				<h4 class="mt-8 mb-4 text-lg font-bold text-stone-900">Create the test scripts</h4>
				<div class="pl-4">
					<!-- prettier-ignore  -->
					<CodeBlock label='create_hard_locks.sql'>
BEGIN;
	DROP TABLE testing.users;
	SELECT pg_sleep(1);
ROLLBACK;
                    </CodeBlock>
					<!-- prettier-ignore  -->
					<CodeBlock label="normal_op.sql">
BEGIN; 
    SELECT * FROM testing.users 
    WHERE id = floor(1 + random() * 100_000); 
COMMIT;
					</CodeBlock>
					<!-- prettier-ignore  -->
					<CodeBlock label="sharelock_long.sql">
BEGIN; 
    UPDATE testing.users 
    SET id = 1_000_001 
    WHERE id = 5; 
    SELECT pg_sleep(1);
ROLLBACK;
					</CodeBlock>
					<!-- prettier-ignore  -->
					<CodeBlock label="sharelock.sql">
BEGIN; 
    UPDATE testing.users 
    SET id = 1_000_001 
    WHERE id = 5; 
ROLLBACK;
                    </CodeBlock>
					<!-- prettier-ignore  -->
					<CodeBlock label="setup.sql">
CREATE SCHEMA IF NOT EXISTS testing;

CREATE TABLE IF NOT EXISTS testing.users (
	id int NOT NULL UNIQUE,
	user_id UUID NOT NULL,
	first_name text,
	last_name text,
	email text
);

-- faster means to vacuum full table
TRUNCATE testing.users;

-- repopulate table with 100K rows
INSERT INTO testing.users (
	id,
	user_id,
	first_name,
	last_name,
	email
)
SELECT 
	id,
	gen_random_uuid() AS user_id,
	random()::TEXT AS first_name,
	random()::TEXT AS last_name,
	random()::TEXT || '@gmail.com' AS email
FROM generate_series(1, 100_000) AS id;
					</CodeBlock>
				</div>
				<h4 class="mt-8 mb-4 text-lg font-bold text-stone-900">
					Change your environment variables for Postgres. It makes it simpler to connect from within
					your machine.
				</h4>
				<div class="pl-4">
					<!-- prettier-ignore  -->
					<CodeBlock>
export PGHOST=localhost
export PGPORT=5432
export PGPASSWORD=&lt;password&gt;
export PGDATABASE=postgres
export PGUSER=postgres
                    </CodeBlock>
				</div>

				<h4 class="mt-8 mb-4 text-lg font-bold text-stone-900">
					In your machine, run the setup script
				</h4>
				<div class="pl-4">
					<p class="p">
						This file determines server settings. Below's is the path to its default location
					</p>
					<!-- prettier-ignore  -->
					<CodeBlock label="setup with PSQL">
psql -U postgres -d postgres -f ./setup.sql
                    </CodeBlock>
				</div>
				<h4 class="mt-8 mb-4 text-lg font-bold text-stone-900">Run PGBench</h4>
				<div class="pl-4">
					<p class="p">The below command runs the script</p>
					<!-- prettier-ignore  -->
					<CodeBlock label="run operations for 1000s">
pgbench \
    -f ./normal_op.sql@200 \
    -f ./create_hard_locks.sql@1 \
    -f ./sharelock_long.sql@1 \
    -f ./sharelock.sql@2 \
    -n \
    -j 2 \
    -c 15 \
    -T 1000
                    </CodeBlock>
				</div>
			</section>
		</DropDown>

		<p class="p">
			To save time, I skipped hands-on testing when a service's demos and public dashboards were
			sufficiently comprehensive, and relied on those instead. This was not my original plan, but
			the setup process for many services proved frustrating and time-consuming. Redgate, in
			particular, required an unreasonable amount of effort just to evaluate, and after more than
			nine hours spent trialing tools, I made concessions to ensure all services could still be
			reviewed.
		</p>
		<p class="p">
			TL;DR: Datadog and PGAnalyze are both excellent tools, but PGAnalyze remains the stronger
			option. NetData can provide moderate visibility over locks. PGBadger offers some insight
			through log files, but it does not provide real-time metrics. The remaining services lacked
			sufficient visibility into locking. That does not make them bad. They are all
			industry-standard tools, but lock management is not part of their core offering.
		</p>
	</section>
	<section class="explainer_section">
		<SectionHeader>Review 1: Redgate</SectionHeader>
	</section>
</article>
