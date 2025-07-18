#!/usr/bin/env python3
"""
Comprehensive Backend API Tests for Habit Stack Builder
Tests all CRUD operations and error handling scenarios
"""

import requests
import json
import sys
import os
from datetime import datetime

# Get backend URL from frontend .env file
def get_backend_url():
    try:
        with open('/app/frontend/.env', 'r') as f:
            for line in f:
                if line.startswith('REACT_APP_BACKEND_URL='):
                    return line.split('=', 1)[1].strip()
    except FileNotFoundError:
        print("❌ Frontend .env file not found")
        return None
    return None

BASE_URL = get_backend_url()
if not BASE_URL:
    print("❌ Could not get backend URL from frontend/.env")
    sys.exit(1)

API_BASE = f"{BASE_URL}/api"

print(f"🔗 Testing API at: {API_BASE}")

class HabitStackTester:
    def __init__(self):
        self.session = requests.Session()
        self.created_stack_id = None
        self.test_results = []
        
    def log_test(self, test_name, success, message=""):
        status = "✅" if success else "❌"
        print(f"{status} {test_name}: {message}")
        self.test_results.append({
            'test': test_name,
            'success': success,
            'message': message
        })
        
    def test_health_check(self):
        """Test the health check endpoint"""
        try:
            response = self.session.get(f"{API_BASE}/health")
            if response.status_code == 200:
                data = response.json()
                if 'status' in data and data['status'] == 'healthy':
                    self.log_test("Health Check", True, "API is healthy")
                    return True
                else:
                    self.log_test("Health Check", False, f"Unexpected response: {data}")
                    return False
            else:
                self.log_test("Health Check", False, f"Status code: {response.status_code}")
                return False
        except Exception as e:
            self.log_test("Health Check", False, f"Exception: {str(e)}")
            return False
            
    def test_get_predefined_routines(self):
        """Test getting predefined routines"""
        try:
            response = self.session.get(f"{API_BASE}/predefined-routines")
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list) and len(data) > 0:
                    # Check if routines have expected structure
                    routine = data[0]
                    required_fields = ['id', 'name', 'description', 'habits']
                    if all(field in routine for field in required_fields):
                        self.log_test("Get Predefined Routines", True, f"Found {len(data)} routines")
                        return True
                    else:
                        self.log_test("Get Predefined Routines", False, "Missing required fields in routine")
                        return False
                else:
                    self.log_test("Get Predefined Routines", False, "No routines returned")
                    return False
            else:
                self.log_test("Get Predefined Routines", False, f"Status code: {response.status_code}")
                return False
        except Exception as e:
            self.log_test("Get Predefined Routines", False, f"Exception: {str(e)}")
            return False
            
    def test_create_habit_stack(self):
        """Test creating a new habit stack"""
        try:
            test_stack = {
                "name": "Morning Productivity Stack",
                "habits": [
                    {"name": "Wake up at 6 AM", "order": 0},
                    {"name": "Drink water", "order": 1},
                    {"name": "Review daily goals", "order": 2}
                ]
            }
            
            response = self.session.post(
                f"{API_BASE}/habit-stacks",
                json=test_stack,
                headers={'Content-Type': 'application/json'}
            )
            
            if response.status_code == 200:
                data = response.json()
                if 'id' in data and 'name' in data and data['name'] == test_stack['name']:
                    self.created_stack_id = data['id']
                    self.log_test("Create Habit Stack", True, f"Created stack with ID: {self.created_stack_id}")
                    return True
                else:
                    self.log_test("Create Habit Stack", False, f"Invalid response structure: {data}")
                    return False
            else:
                self.log_test("Create Habit Stack", False, f"Status code: {response.status_code}, Response: {response.text}")
                return False
        except Exception as e:
            self.log_test("Create Habit Stack", False, f"Exception: {str(e)}")
            return False
            
    def test_get_all_habit_stacks(self):
        """Test getting all habit stacks"""
        try:
            response = self.session.get(f"{API_BASE}/habit-stacks")
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list):
                    self.log_test("Get All Habit Stacks", True, f"Retrieved {len(data)} stacks")
                    return True
                else:
                    self.log_test("Get All Habit Stacks", False, "Response is not a list")
                    return False
            else:
                self.log_test("Get All Habit Stacks", False, f"Status code: {response.status_code}")
                return False
        except Exception as e:
            self.log_test("Get All Habit Stacks", False, f"Exception: {str(e)}")
            return False
            
    def test_get_specific_habit_stack(self):
        """Test getting a specific habit stack by ID"""
        if not self.created_stack_id:
            self.log_test("Get Specific Habit Stack", False, "No stack ID available")
            return False
            
        try:
            response = self.session.get(f"{API_BASE}/habit-stacks/{self.created_stack_id}")
            if response.status_code == 200:
                data = response.json()
                if 'id' in data and data['id'] == self.created_stack_id:
                    self.log_test("Get Specific Habit Stack", True, f"Retrieved stack: {data['name']}")
                    return True
                else:
                    self.log_test("Get Specific Habit Stack", False, f"ID mismatch or invalid structure: {data}")
                    return False
            else:
                self.log_test("Get Specific Habit Stack", False, f"Status code: {response.status_code}")
                return False
        except Exception as e:
            self.log_test("Get Specific Habit Stack", False, f"Exception: {str(e)}")
            return False
            
    def test_add_habit_to_stack(self):
        """Test adding a habit to an existing stack"""
        if not self.created_stack_id:
            self.log_test("Add Habit to Stack", False, "No stack ID available")
            return False
            
        try:
            new_habit = {
                "name": "Meditate for 10 minutes",
                "order": 3
            }
            
            response = self.session.post(
                f"{API_BASE}/habit-stacks/{self.created_stack_id}/habits",
                json=new_habit,
                headers={'Content-Type': 'application/json'}
            )
            
            if response.status_code == 200:
                data = response.json()
                if 'habits' in data and len(data['habits']) == 4:  # Should have 4 habits now
                    # Check if the new habit was added
                    habit_names = [habit['name'] for habit in data['habits']]
                    if new_habit['name'] in habit_names:
                        self.log_test("Add Habit to Stack", True, f"Added habit: {new_habit['name']}")
                        return True
                    else:
                        self.log_test("Add Habit to Stack", False, "New habit not found in response")
                        return False
                else:
                    self.log_test("Add Habit to Stack", False, f"Unexpected habits count: {len(data.get('habits', []))}")
                    return False
            else:
                self.log_test("Add Habit to Stack", False, f"Status code: {response.status_code}, Response: {response.text}")
                return False
        except Exception as e:
            self.log_test("Add Habit to Stack", False, f"Exception: {str(e)}")
            return False
            
    def test_update_habit_stack(self):
        """Test updating a habit stack"""
        if not self.created_stack_id:
            self.log_test("Update Habit Stack", False, "No stack ID available")
            return False
            
        try:
            # First get the current stack to get habit IDs
            get_response = self.session.get(f"{API_BASE}/habit-stacks/{self.created_stack_id}")
            if get_response.status_code != 200:
                self.log_test("Update Habit Stack", False, "Could not retrieve current stack")
                return False
                
            current_stack = get_response.json()
            habits = current_stack.get('habits', [])
            
            # Update the stack name and reorder habits
            update_data = {
                "name": "Updated Morning Productivity Stack",
                "habits": [
                    {
                        "id": habit['id'],
                        "name": habit['name'],
                        "order": len(habits) - habit['order'] - 1  # Reverse order
                    } for habit in habits
                ]
            }
            
            response = self.session.put(
                f"{API_BASE}/habit-stacks/{self.created_stack_id}",
                json=update_data,
                headers={'Content-Type': 'application/json'}
            )
            
            if response.status_code == 200:
                data = response.json()
                if data['name'] == update_data['name']:
                    self.log_test("Update Habit Stack", True, f"Updated stack name to: {data['name']}")
                    return True
                else:
                    self.log_test("Update Habit Stack", False, f"Name not updated correctly: {data['name']}")
                    return False
            else:
                self.log_test("Update Habit Stack", False, f"Status code: {response.status_code}, Response: {response.text}")
                return False
        except Exception as e:
            self.log_test("Update Habit Stack", False, f"Exception: {str(e)}")
            return False
            
    def test_remove_habit_from_stack(self):
        """Test removing a habit from a stack"""
        if not self.created_stack_id:
            self.log_test("Remove Habit from Stack", False, "No stack ID available")
            return False
            
        try:
            # First get the current stack to get a habit ID
            get_response = self.session.get(f"{API_BASE}/habit-stacks/{self.created_stack_id}")
            if get_response.status_code != 200:
                self.log_test("Remove Habit from Stack", False, "Could not retrieve current stack")
                return False
                
            current_stack = get_response.json()
            habits = current_stack.get('habits', [])
            
            if not habits:
                self.log_test("Remove Habit from Stack", False, "No habits to remove")
                return False
                
            habit_to_remove = habits[0]  # Remove the first habit
            habit_id = habit_to_remove['id']
            
            response = self.session.delete(f"{API_BASE}/habit-stacks/{self.created_stack_id}/habits/{habit_id}")
            
            if response.status_code == 200:
                # Verify the habit was removed
                verify_response = self.session.get(f"{API_BASE}/habit-stacks/{self.created_stack_id}")
                if verify_response.status_code == 200:
                    updated_stack = verify_response.json()
                    remaining_habits = updated_stack.get('habits', [])
                    remaining_ids = [h['id'] for h in remaining_habits]
                    
                    if habit_id not in remaining_ids:
                        self.log_test("Remove Habit from Stack", True, f"Removed habit: {habit_to_remove['name']}")
                        return True
                    else:
                        self.log_test("Remove Habit from Stack", False, "Habit still exists after deletion")
                        return False
                else:
                    self.log_test("Remove Habit from Stack", False, "Could not verify deletion")
                    return False
            else:
                self.log_test("Remove Habit from Stack", False, f"Status code: {response.status_code}")
                return False
        except Exception as e:
            self.log_test("Remove Habit from Stack", False, f"Exception: {str(e)}")
            return False
            
    def test_error_handling(self):
        """Test error handling scenarios"""
        tests_passed = 0
        total_tests = 3
        
        # Test 1: Get non-existent stack
        try:
            response = self.session.get(f"{API_BASE}/habit-stacks/non-existent-id")
            if response.status_code == 404:
                self.log_test("Error Handling - Non-existent Stack", True, "Correctly returned 404")
                tests_passed += 1
            else:
                self.log_test("Error Handling - Non-existent Stack", False, f"Expected 404, got {response.status_code}")
        except Exception as e:
            self.log_test("Error Handling - Non-existent Stack", False, f"Exception: {str(e)}")
            
        # Test 2: Create stack with invalid data
        try:
            invalid_data = {"invalid_field": "test"}
            response = self.session.post(
                f"{API_BASE}/habit-stacks",
                json=invalid_data,
                headers={'Content-Type': 'application/json'}
            )
            if response.status_code in [400, 422]:  # Bad request or validation error
                self.log_test("Error Handling - Invalid Data", True, f"Correctly returned {response.status_code}")
                tests_passed += 1
            else:
                self.log_test("Error Handling - Invalid Data", False, f"Expected 400/422, got {response.status_code}")
        except Exception as e:
            self.log_test("Error Handling - Invalid Data", False, f"Exception: {str(e)}")
            
        # Test 3: Update non-existent stack
        try:
            response = self.session.put(
                f"{API_BASE}/habit-stacks/non-existent-id",
                json={"name": "Test"},
                headers={'Content-Type': 'application/json'}
            )
            if response.status_code == 404:
                self.log_test("Error Handling - Update Non-existent", True, "Correctly returned 404")
                tests_passed += 1
            else:
                self.log_test("Error Handling - Update Non-existent", False, f"Expected 404, got {response.status_code}")
        except Exception as e:
            self.log_test("Error Handling - Update Non-existent", False, f"Exception: {str(e)}")
            
        return tests_passed == total_tests
        
    def test_delete_habit_stack(self):
        """Test deleting a habit stack"""
        if not self.created_stack_id:
            self.log_test("Delete Habit Stack", False, "No stack ID available")
            return False
            
        try:
            response = self.session.delete(f"{API_BASE}/habit-stacks/{self.created_stack_id}")
            
            if response.status_code == 200:
                # Verify the stack was deleted
                verify_response = self.session.get(f"{API_BASE}/habit-stacks/{self.created_stack_id}")
                if verify_response.status_code == 404:
                    self.log_test("Delete Habit Stack", True, "Stack successfully deleted")
                    return True
                else:
                    self.log_test("Delete Habit Stack", False, "Stack still exists after deletion")
                    return False
            else:
                self.log_test("Delete Habit Stack", False, f"Status code: {response.status_code}")
                return False
        except Exception as e:
            self.log_test("Delete Habit Stack", False, f"Exception: {str(e)}")
            return False
            
    def run_all_tests(self):
        """Run all tests in sequence"""
        print("🚀 Starting Habit Stack Builder API Tests")
        print("=" * 50)
        
        # Test sequence
        tests = [
            self.test_health_check,
            self.test_get_predefined_routines,
            self.test_create_habit_stack,
            self.test_get_all_habit_stacks,
            self.test_get_specific_habit_stack,
            self.test_add_habit_to_stack,
            self.test_update_habit_stack,
            self.test_remove_habit_from_stack,
            self.test_error_handling,
            self.test_delete_habit_stack
        ]
        
        passed = 0
        total = len(tests)
        
        for test in tests:
            if test():
                passed += 1
                
        print("\n" + "=" * 50)
        print(f"📊 Test Results: {passed}/{total} tests passed")
        
        if passed == total:
            print("🎉 All tests passed! API is working correctly.")
            return True
        else:
            print(f"⚠️  {total - passed} tests failed. Check the issues above.")
            return False

def main():
    """Main test execution"""
    tester = HabitStackTester()
    success = tester.run_all_tests()
    
    if success:
        print("\n✅ Backend API testing completed successfully!")
        sys.exit(0)
    else:
        print("\n❌ Backend API testing completed with failures!")
        sys.exit(1)

if __name__ == "__main__":
    main()