import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import styles from './index.module.css';

export default function Home() {
  const { siteConfig } = useDocusaurusContext();

  return (
    <Layout title="Documentation" description={siteConfig.tagline}>
      <main className={styles.page}>
        <div className={styles.choices}>
          <Link className={`${styles.choiceCard} ${styles.hardwareCard}`} to="/hardware">
            <span className={styles.choiceText}>Build With EtherCAT PCB Modules</span>
            <span className={styles.choiceArrow}>Explore →</span>
          </Link>

          <Link className={`${styles.choiceCard} ${styles.lxmasterCard}`} to="/lxmaster/overview">
            <span className={styles.choiceText}>LXMASTER EtherCAT Master</span>
            <span className={styles.choiceArrow}>Explore →</span>
          </Link>
        </div>
      </main>
    </Layout>
  );
}
