import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import styles from './index.module.css';

export default function Home() {
  const { siteConfig } = useDocusaurusContext();

  return (
    <Layout title="Documentation" description={siteConfig.tagline} noFooter>
      <main className={styles.page}>
        <p className={styles.prompt}>What do you want to learn about?</p>

        <div className={styles.choices}>
          <Link className={`${styles.choiceCard} ${styles.hardwareCard}`} to="/hardware">
            <span className={styles.choiceLabel}>EtherCAT PCB Modules</span>
            <span className={styles.choiceText}>
              How to design with Lynx EtherCAT PCB Modules
            </span>
            <span className={styles.choiceArrow}>Explore →</span>
          </Link>

          <Link className={`${styles.choiceCard} ${styles.lxmasterCard}`} to="/lxmaster/overview">
            <span className={styles.choiceLabel}>LXMASTER</span>
            <span className={styles.choiceText}>
              How to use LXMASTER to control any EtherCAT hardware
            </span>
            <span className={styles.choiceArrow}>Explore →</span>
          </Link>
        </div>
      </main>
    </Layout>
  );
}
