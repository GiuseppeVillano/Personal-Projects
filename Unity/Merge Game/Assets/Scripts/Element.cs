using System.Collections;
using System.Collections.Generic;
using UnityEngine;

[CreateAssetMenu(fileName = "New Element", menuName = "Element")]
public class Element : ScriptableObject {
    public string elemDescription;
    public List<Sprite> elemSprite;
    public List<int> costs;       
}
