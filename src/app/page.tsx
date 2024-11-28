import styles from "./page.module.scss";
import Image from "next/image";

interface NewsArticle {
  title: string;
  description: string;
  creator: string;
  link: string;
  pubDate: number;
  source_name: string;
  source_icon: string;
}

const apikey = process.env.API_KEY

// Fetch articles from NewsData API
async function fetchBitcoinNews(): Promise<NewsArticle[]> {
  const res = await fetch(`https://newsdata.io/api/1/news?apikey=${apikey}&q=bitcoin`, {
    cache: "no-store",
  });
  const jsonData = await res.json();

  const articles = jsonData.data || [];

  return articles as NewsArticle[];
}

// Function to truncate a string to a specified length
const truncateString = (str: string, num: number): string => {
  if (str.length > num) {
    return str.slice(0, num) + "..."; 
  }
  return str;
};

export default async function HomePage() {
  const newsArticles = await fetchBitcoinNews();

  return (
    <div className={styles.articleContainer}>
      <p>Your go-to source for the latest Bitcoin news.</p>
      <div className={styles.articles}>
        {newsArticles.length > 0 ? (
          newsArticles.map((article) => (
            <div key={article.link} className={styles.articleCard}>
              <div>
                <h2>{article.title}</h2>
              </div>
              <div>
                <div className={styles.imagePlaceholder}>
                  {article.source_icon && article.source_icon !== "missing_large.png" ? (
                    <Image src={article.source_icon} alt={article.title} width={1920} height={1080} />
                  ) : (
                    <div className={styles.noImage}>No picture available.</div>
                  )}
                </div>
                <p>{truncateString(article.description, 300)}</p>
                <h4>
                  <strong>Author:</strong> <span>{article.creator}</span>
                </h4>
                <h4>
                  <strong>Source:</strong> <span>{article.source_name}</span>
                </h4>
                <h4>
                  <strong>Published:</strong>{" "}
                  <span>{new Date(article.pubDate * 1000).toLocaleDateString()}</span>
                </h4>
                <a href={article.link} target="_blank" rel="noopener noreferrer">
                  Read More
                </a>
              </div>
            </div>
          ))
        ) : (
          <p>No articles available at this time.</p>
        )}
      </div>
    </div>
  );
}
