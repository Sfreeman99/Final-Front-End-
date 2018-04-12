from selenium import webdriver
import unittest
from time import sleep


class TestLoadsPage(unittest.TestCase):
    def setUp(self):
        self.browser = webdriver.Chrome()
        self.browser.implicitly_wait(5)

    def tearDown(self):
        self.browser.quit()

    def signup(self):
        self.assertEquals(self.browser.current_url,
                          "http://localhost:3000/signup",
                          "The browser did not load")
        first_name_field = self.browser.find_element_by_id(
            "FirstName").send_keys("John")
        last_name_field = self.browser.find_element_by_id(
            "LastName").send_keys("Doe")
        email_name_field = self.browser.find_element_by_id("Email").send_keys(
            "johndoe@gmail.com")
        username_field = self.browser.find_element_by_id("Username").send_keys(
            "johndoe")
        Password_field = self.browser.find_element_by_id(
            "Password1").send_keys("johndoe123")
        Repeat_Password_field = self.browser.find_element_by_id(
            "Password2").send_keys("johndoe123")
        self.browser.find_element_by_id("SignupUser").click()
        sleep(2)
        self.assertEquals(self.browser.current_url,
                          "http://localhost:3000/accountSummary")
        logout = self.browser.find_element_by_id("logout").click()

    def login(self):
        click_login_button = self.browser.find_element_by_id("login").click()
        self.assertEquals(self.browser.current_url,
                          "http://localhost:3000/login",
                          "Browser did not load login page")
        sleep(2)
        enter_username = self.browser.find_element_by_id("Username").send_keys(
            "johndoe")
        enter_password = self.browser.find_element_by_id("Password").send_keys(
            "johndoe123")
        press_login_button = self.browser.find_element_by_id("login").click()
        sleep(2)
        self.assertEquals(self.browser.current_url,
                          "http://localhost:3000/accountSummary",
                          "It did not redirect to the accountSummary page")
        logout = self.browser.find_element_by_id("logout").click()
        sleep(2)
        self.assertEquals(self.browser.current_url,
                          "http://localhost:3000/signup",
                          "It did not successfully redirect to Signup")

    def deposit_transaction(self):
        self.browser.get("http://localhost:3000/signup")
        click_login_button = self.browser.find_element_by_id("login").click()
        sleep(2)
        self.assertEquals(self.browser.current_url,
                          "http://localhost:3000/login",
                          "Browser did not load login page")
        enter_username = self.browser.find_element_by_id("Username").send_keys(
            "johndoe")
        enter_password = self.browser.find_element_by_id("Password").send_keys(
            "johndoe123")
        press_login_button = self.browser.find_element_by_id("login").click()
        deposit_ten_dollars = self.browser.find_element_by_name(
            "deposit").send_keys("10")
        click_deposit_button = self.browser.find_element_by_id(
            "deposit").click()

    def withdraw_transaction(self):
        withdraw_ten_dollars = self.browser.find_element_by_name(
            "withdraw").send_keys("10")
        click_withdraw_button = self.browser.find_element_by_id(
            "withdraw").click()

    def delete_account(self):
        press_delete_account = self.browser.find_element_by_id(
            "delete_account").click()
        sleep(2)
        confirm_delete = self.browser.find_element_by_id(
            "comfirm_delete").click()
        sleep(2)
        self.assertEquals(self.browser.current_url,
                          "http://localhost:3000/signup",
                          "Did not redirect after deleting account")

    def test_every_feature_below(self):
        self.browser.get("http://localhost:3000/signup")
        self.signup()
        self.login()
        self.deposit_transaction()
        self.withdraw_transaction()
        self.delete_account()


if __name__ == "__main__":
    unittest.main(warnings='ignore')