using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Enemy : MonoBehaviour {
    public GameObject bullet;
    public float speed = 1;

    private int HP = 1;

    void Start() {
        float rand=0f;
        if (gameObject.name.Contains("Clone")) {
            gameObject.SetActive(true);
        }
        if (gameObject.name == "Ufo(Clone)") {
            HP = 3;
            StartCoroutine(Fire());
        }
        else {
            rand = Random.Range(-30, 30);
        }
        //Look at Player
        GameObject player = GameObject.Find("Player");
        Vector3 dir = player.transform.position - transform.position;
        float angle = Mathf.Atan2(dir.y, dir.x) * Mathf.Rad2Deg;
        transform.rotation = Quaternion.AngleAxis(angle - 90+rand, Vector3.forward);        
    }

    private void Update() {
        transform.position += transform.up * speed * Time.deltaTime;
    }

    IEnumerator Fire() {
        //Ufo firing every 1.5secs
        while (true) {
            float t = 0;
            while (t < 1.5f) {
                t += Time.deltaTime;
                yield return null;
            }

            GameObject b = Instantiate(bullet, transform.position, transform.rotation);
            b.GetComponent<Bullet>().SetEnemyBullet();
            b.SetActive(true);
            
            t = 0;
            while (t < 1.5f) {
                t += Time.deltaTime;
                yield return null;
            }
        }
    }
    public void SetSmaller() {
        gameObject.transform.localScale = new Vector3(1, 1, 1);
    }

    private void OnTriggerEnter2D(Collider2D collision) {
        if (collision.name == "Bullet(Clone)" && !collision.gameObject.GetComponent<Bullet>().EnemyBulletType()) {
            if (gameObject.name.Contains("Asteroid") && gameObject.transform.localScale.x >= 2.5) {
                for (int i = 0; i < 2; i++) {
                    GameObject a = Instantiate(gameObject, transform.position, Quaternion.identity);
                    a.SetActive(true);
                    a.GetComponent<Enemy>().SetSmaller();
                }
            }
            Destroy(collision);
            HP--;
            if (HP == 0) {
                GameObject player = GameObject.Find("Player");
                if (gameObject.name.Contains("Ufo")) {
                    player.GetComponent<Player>().Score(500);
                }
                else if (gameObject.name.Contains("Asteroid")) {
                    if (gameObject.transform.localScale.x >= 2.5) {
                        player.GetComponent<Player>().Score(100);
                    }
                    else {
                        player.GetComponent<Player>().Score(50);
                    }
                }
                Destroy(gameObject);
            }
        }
    }    
}
