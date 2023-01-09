using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Player : MonoBehaviour {
    //Max HP
    public int maxHp = 3;
    public Rigidbody2D RB;
    public float Speed = 2;
    public Transform OwnT;
    public Game GameLogic;

    //Max acceleration speed
    public int maxStack = 5;
    //Max angular speed
    public int maxAngularSpeed = 130;

    //How many degree to rotate
    public int degrees = 1;
    private int turnDirection = 0;
    //Activate Deceleration
    public bool autoDeceleration = true;
    //Inserte type of bullet
    public GameObject bullet;
    //Camera
    public GameObject mainCamera;
    //current hp
    private int hp;
    private int score;
    //For Flashing at dmg
    private Renderer r;

    private Coroutine FlashRoutine;

    private void Start() {
        //Deactive prefab
        bullet.SetActive(false);
        hp = maxHp;
        r = this.GetComponent<Renderer>();
    }

    // Update is called once per frame
    void Update() {
        Controller();
    }
    
    private void FixedUpdate() {
        if (Input.GetKey(KeyCode.W)) {
            Vector3 force = OwnT.forward;
            force.y = force.z;
            RB.AddRelativeForce(force * Speed, ForceMode2D.Force);

            Vector2 currentVelocity = RB.velocity;
            currentVelocity = Vector2.ClampMagnitude(currentVelocity, Speed);
            RB.velocity = currentVelocity;
        }
        if (turnDirection != 0 && Mathf.Abs(RB.angularVelocity)<maxAngularSpeed) {
            RB.AddTorque(degrees*turnDirection);
        }
        
    }
    void Controller() {
        //Rotation
        if (Input.GetKey(KeyCode.A)) {
            turnDirection = 1;
        }
        else if (Input.GetKey(KeyCode.D)) {
            turnDirection = -1;
        }
        else {
            turnDirection = 0;
        }
        //Fire
        if (Input.GetMouseButtonDown(0)) {
            Fire();
        }
    }
    void Fire() {
        if (bullet == null) {
            print("Associate a bullet first!");
            return;
        }
        GameObject b = Instantiate(bullet, transform.position, transform.rotation);
        b.SetActive(true);
    }
    public void Score(int n) {
        score += n;
        UIController.Instance.SetScoreText(score);
    }
    private void OnTriggerEnter2D(Collider2D collision) {
        if (collision.name.Contains("Asteroid") ||
            collision.name == "Ufo(Clone)" ||
           (collision.name == "Bullet(Clone)" && collision.gameObject.GetComponent<Bullet>().EnemyBulletType())) {
            Destroy(collision);
            UIController.Instance.SetLifePoints(hp);
            if (hp == 0) {
                mainCamera.GetComponent<Game>().ResetAll(score);
                Destroy(gameObject);
            }
            else {
                if (FlashRoutine == null) {
                    FlashRoutine = StartCoroutine(Flash());
                }
            }
        }
    }
    IEnumerator Flash() {
        Color original = r.material.color;
        Color transparent = r.material.color;
        original.a = 1f;
        transparent.a = 0f;

        float t = 0;
        for (int i = 0; i < 2; i++) {
            r.material.color = transparent;
            while (t < 0.1f) {
                t += Time.deltaTime;
                yield return null;
            }
            r.material.color = original;
            t = 0;
            while (t < 0.1f) {
                t += Time.deltaTime;
                yield return null;
            }
        }
        FlashRoutine = null;
    }
}
