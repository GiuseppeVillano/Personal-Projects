using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Bullet : MonoBehaviour {
    //bullet speed
    public float speed = 5;
    public AudioSource audioB;
    private bool isEnemyBullet = false;

    void Start() {
        if (gameObject.name.Contains("Clone")) {
            audioB.Play(0);
        }
        if (gameObject.activeSelf) {
            GameObject cameraMain = GameObject.Find("Main Camera");
            cameraMain.GetComponent<Game>().DestroyIfOff(gameObject);
        }
    }

    void Update() {
        //move based on facing position, enstablished on instantiate
        transform.position += transform.up * speed * Time.deltaTime;
    }

    public bool EnemyBulletType() {
        return isEnemyBullet;
    }

    public void SetEnemyBullet() {
        isEnemyBullet = true;
    }

    //Out of Camera screen
    private void OnTriggerExit2D(Collider2D collision) {
        if (collision.gameObject.name == "Main Camera") {
            Destroy(gameObject);
        }
    }
}
