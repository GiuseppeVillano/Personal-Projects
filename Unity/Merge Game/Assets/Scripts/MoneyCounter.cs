using System.Collections;
using TMPro;
using UnityEngine;

public class MoneyCounter : MonoBehaviour {
    public TextMeshProUGUI coinsText;
    public float speedUpdateAmount;
    
    public bool smoothMovement = true;
    private int targetAmount = 0;
    private int currentAmount = 0;

    private Coroutine smoothChangeAmount;

    void ResetCoroutineReference() {
        if (smoothChangeAmount != null) {
            StopCoroutine(smoothChangeAmount);
            smoothChangeAmount = null;
        }
    }

    void StartUpdateMoney() {
        if (smoothMovement) {
            smoothChangeAmount = StartCoroutine(SmoothChangeAmount());
        }
        else {
            currentAmount = targetAmount;
            UpdateUI(currentAmount);
        }
    }

    public void SwitchMode() {
        ResetCoroutineReference();
        StartUpdateMoney();
    }

    public void UpdateCoinsAmount(int newAmount) {
        ResetCoroutineReference();
        targetAmount = newAmount;
        StartUpdateMoney();
    }

    void UpdateUI(int amount) {
        coinsText.text = amount.ToString();
    }

    IEnumerator SmoothChangeAmount() {
        float timer = 0;
        while (true) {
            timer += Time.deltaTime;

            //Change amount based on currentAmount and targetAmount difference
            if (timer >= speedUpdateAmount) {
                currentAmount = currentAmount < targetAmount ? ++currentAmount : --currentAmount ;
                timer = 0;
            }

            UpdateUI(currentAmount);
            //Break and reset if reached the amount
            if (currentAmount == targetAmount) {
                smoothChangeAmount = null;
                break;
            }

            yield return null;
        }
    }

}
