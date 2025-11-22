import styles from "./page.module.css";
import Timeline from "./Timeline";

const { Client } = require("@notionhq/client");
const notion = new Client({ auth: process.env.NOTION_KEY });

const data = async() => {
  const test = await notion.databases.query({
    database_id: process.env.NOTION_PAGE_ID,
  });
  console.log(test);``
}

export default function Home() {
  data();
  return <main>
    <h2 className={styles.title}>Family Timeline</h2>
    <Timeline />
  </main>;
}
